const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extract tweet ID from various Twitter URL formats
 * @param {string} url - Twitter URL
 * @returns {string|null} Tweet ID or null if not found
 */
function extractTweetId(url) {
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /nitter\.net\/\w+\/status\/(\d+)/,
    /status\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Scrape tweet content from Nitter
 * @param {string} tweetId - Tweet ID
 * @returns {Promise<string>} Tweet text content
 */
async function scrapeTweet(tweetId) {
  const nitterInstances = [
    "https://nitter.net",
    "https://nitter.it",
    "https://nitter.unixfox.eu",
    "https://nitter.privacydev.net",
  ];

  for (const instance of nitterInstances) {
    try {
      const url = `${instance}/i/status/${tweetId}`;
      console.log(`Trying to scrape from: ${url}`);

      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        timeout: 10000,
      });

      if (!response.ok) {
        console.log(`Failed to fetch from ${instance}: ${response.status}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Try multiple selectors to find tweet content
      const selectors = [
        ".main-tweet .tweet-content",
        ".tweet-content",
        ".tweet-text",
        ".content",
        '[class*="tweet"] [class*="content"]',
        ".timeline-item .tweet-content",
      ];

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          const text = element.text().trim();
          if (text && text.length > 10) {
            console.log(`Found tweet content using selector: ${selector}`);
            return text;
          }
        }
      }

      // Fallback: look for any text that might be a tweet
      const allText = $("body").text();
      const lines = allText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 20 && line.length < 500);

      if (lines.length > 0) {
        console.log("Using fallback text extraction");
        return lines[0];
      }
    } catch (error) {
      console.log(`Error scraping from ${instance}:`, error.message);
      continue;
    }
  }

  throw new Error("Could not scrape tweet from any Nitter instance");
}

/**
 * Generate AI reply using OpenAI
 * @param {string} tweetText - The tweet text
 * @returns {Promise<string>} Generated reply
 */
async function generateReply(tweetText) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a witty Twitter reply guy. Respond casually, like a human, sometimes with emojis or Gen Z slang. Keep replies under 280 characters and make them engaging and authentic. Don't be overly formal or robotic.",
        },
        {
          role: "user",
          content: `Tweet: ${tweetText}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate reply");
  }
}

/**
 * Process a single tweet URL
 * @param {string} url - Tweet URL
 * @returns {Promise<Object>} Result object
 */
async function processTweet(url) {
  try {
    const tweetId = extractTweetId(url);
    if (!tweetId) {
      throw new Error("Invalid Twitter URL format");
    }

    console.log(`Processing tweet ID: ${tweetId}`);
    const tweetText = await scrapeTweet(tweetId);
    const reply = await generateReply(tweetText);

    return {
      url,
      tweet: tweetText,
      reply,
    };
  } catch (error) {
    console.error(`Error processing ${url}:`, error.message);
    return {
      url,
      tweet: `[Error: ${error.message}]`,
      reply: "[Unable to generate reply due to error]",
    };
  }
}

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Reply Guy API Server",
    status: "running",
    endpoints: {
      scrape: "POST /scrape - Process Twitter links and generate replies",
    },
  });
});

app.post("/scrape", async (req, res) => {
  try {
    const { links } = req.body;

    if (!links || !Array.isArray(links) || links.length === 0) {
      return res.status(400).json({
        error: 'Invalid request. Expected "links" array with Twitter URLs.',
      });
    }

    console.log(`Received ${links.length} links to process`);

    // Process tweets sequentially to avoid rate limiting
    const results = [];
    for (let i = 0; i < links.length; i++) {
      const url = links[i];
      console.log(`Processing ${i + 1}/${links.length}: ${url}`);

      const result = await processTweet(url);
      results.push(result);

      // Add delay between requests to be respectful
      if (i < links.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(`Completed processing ${results.length} tweets`);
    res.json(results);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Reply Guy API Server running on http://localhost:${port}`);
  console.log(`📝 POST /scrape to process Twitter links`);

  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️  OPENAI_API_KEY not found in environment variables");
  }
});

module.exports = app;
