/**
 * Tweet Processor Module
 * Handles tweet ID extraction and content fetching
 */
class TweetProcessor {
  constructor(nitterInstance = "https://nitter.net") {
    this.nitterInstance = nitterInstance;
  }

  /**
   * Extract tweet IDs from various Twitter URL formats
   * @param {string} links - Newline-separated Twitter links
   * @returns {string[]} Array of unique tweet IDs
   */
  extractTweetIds(links) {
    const tweetIds = [];
    const lines = links.trim().split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Handle various Twitter URL formats
      const patterns = [
        /twitter\.com\/\w+\/status\/(\d+)/,
        /x\.com\/\w+\/status\/(\d+)/,
        /nitter\.net\/\w+\/status\/(\d+)/,
        /status\/(\d+)/,
      ];

      for (const pattern of patterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          tweetIds.push(match[1]);
          break;
        }
      }
    }

    return [...new Set(tweetIds)]; // Remove duplicates
  }

  /**
   * Fetch tweet content from Nitter
   * @param {string} tweetId - The tweet ID to fetch
   * @returns {Promise<string>} The tweet text content
   */
  async fetchTweetContent(tweetId) {
    try {
      const url = `${this.nitterInstance}/i/status/${tweetId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return this.extractTweetText(html);
    } catch (error) {
      console.error(`Error fetching tweet ${tweetId}:`, error);
      throw error;
    }
  }

  /**
   * Extract tweet text from HTML content
   * @param {string} html - The HTML content from Nitter
   * @returns {string} The extracted tweet text
   */
  extractTweetText(html) {
    try {
      // Look for tweet content in various possible selectors
      const selectors = [
        ".tweet-content",
        ".tweet-text",
        ".content",
        '[class*="tweet"]',
        '[class*="content"]',
      ];

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      for (const selector of selectors) {
        const elements = doc.querySelectorAll(selector);
        for (const element of elements) {
          const text = element.textContent?.trim();
          if (text && text.length > 10) {
            return text;
          }
        }
      }

      // Fallback: try to find any text content that looks like a tweet
      const allText = doc.body.textContent || "";
      const lines = allText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 10);

      if (lines.length > 0) {
        return lines[0];
      }

      throw new Error("Could not extract tweet text");
    } catch (error) {
      console.error("Error extracting tweet text:", error);
      throw new Error("Failed to parse tweet content");
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = TweetProcessor;
}
