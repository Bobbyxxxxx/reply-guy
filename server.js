const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to extract tweet text from HTML
const extractTweetText = (html) => {
  const $ = cheerio.load(html);

  // Try multiple selectors for tweet content
  let tweetText = $(".tweet-content").text().trim();

  if (!tweetText) {
    tweetText = $(".main-tweet .tweet-content").text().trim();
  }

  if (!tweetText) {
    tweetText = $('meta[property="og:description"]').attr("content") || "";
  }

  if (!tweetText) {
    tweetText = $(".timeline-item .tweet-content").text().trim();
  }

  return tweetText || "[Could not parse tweet text]";
};

// POST endpoint to generate replies
app.post("/generate-replies", async (req, res) => {
  try {
    const { tweet_urls } = req.body;

    if (!tweet_urls || !Array.isArray(tweet_urls)) {
      return res.status(400).json({
        error: "tweet_urls array is required",
      });
    }

    const results = [];

    for (let i = 0; i < tweet_urls.length; i++) {
      const url = tweet_urls[i];
      let tweetText = "";

      try {
        // Fetch the tweet page
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        // Extract tweet text
        tweetText = extractTweetText(response.data);
      } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        tweetText = `[Error fetching tweet: ${error.message}]`;
      }

      // Generate reply using OpenAI
      let reply = "";
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Write a casual reply to this tweet: ${tweetText}`,
            },
          ],
          max_tokens: 60,
          temperature: 0.7,
        });

        reply = completion.choices[0].message.content.trim();
      } catch (error) {
        console.error("OpenAI API error:", error.message);
        reply = `[Error from OpenAI: ${error.message}]`;
      }

      results.push({
        tweet: tweetText,
        reply: reply,
      });

      // Wait 1 second between requests (except for the last one)
      if (i < tweet_urls.length - 1) {
        await delay(1000);
      }
    }

    res.json(results);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Reply Guy Backend is running!",
    endpoint: "POST /generate-replies",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("POST /generate-replies to generate tweet replies");
});
