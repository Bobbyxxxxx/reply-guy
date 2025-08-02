/**
 * Main Application Module
 * Orchestrates all components and handles the main application logic
 */
class ReplyGuyApp {
  constructor() {
    this.apiClient = new ApiClient();
    this.uiManager = new UIManager();

    this.initializeEventListeners();
    this.checkServerStatus();
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    const processButton = document.getElementById("processButton");
    processButton.addEventListener("click", () => this.processTweets());
  }

  /**
   * Check if backend server is running
   */
  async checkServerStatus() {
    try {
      const isRunning = await this.apiClient.checkServerStatus();
      if (!isRunning) {
        this.uiManager.showError(
          "⚠️ Backend server not running. Please start the server with 'npm start' and ensure it's running on http://localhost:3000"
        );
      }
    } catch (error) {
      console.error("Server status check failed:", error);
    }
  }

  /**
   * Extract tweet URLs from input text
   * @param {string} linksText - Input text with URLs
   * @returns {string[]} Array of valid Twitter URLs
   */
  extractTweetUrls(linksText) {
    const lines = linksText.trim().split("\n");
    const urls = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Check if it's a valid Twitter URL
      const patterns = [
        /https?:\/\/(twitter\.com|x\.com|nitter\.net)\/\w+\/status\/\d+/,
        /https?:\/\/[^\/]+\/\w+\/status\/\d+/,
      ];

      for (const pattern of patterns) {
        if (pattern.test(trimmedLine)) {
          urls.push(trimmedLine);
          break;
        }
      }
    }

    return [...new Set(urls)]; // Remove duplicates
  }

  /**
   * Main method to process tweets via backend API
   */
  async processTweets() {
    // Validate input
    if (!this.uiManager.validateInput()) {
      return;
    }

    const linksText = this.uiManager.getInputValue();
    const urls = this.extractTweetUrls(linksText);

    if (urls.length === 0) {
      alert("No valid Twitter links found. Please check your input!");
      return;
    }

    // Setup UI state
    this.uiManager.setTotalTweets(urls.length);
    this.uiManager.resetProgress();
    this.uiManager.showLoading();
    this.uiManager.clearResults();

    try {
      console.log(`Sending ${urls.length} URLs to backend for processing`);

      // Send all URLs to backend for processing
      const results = await this.apiClient.processTweets(urls);

      console.log("Received results from backend:", results);

      // Process results and update UI
      results.forEach((result, index) => {
        this.uiManager.addResult({
          tweetId: this.extractTweetIdFromUrl(result.url),
          tweetText: result.tweet,
          reply: result.reply,
        });

        // Update progress for each result
        this.uiManager.updateProgress();
      });

      // Display results
      this.uiManager.displayResults();
    } catch (error) {
      console.error("Error processing tweets:", error);
      this.uiManager.showError(
        `Failed to process tweets: ${error.message}. Please ensure the backend server is running.`
      );
    } finally {
      this.uiManager.hideLoading();
    }
  }

  /**
   * Extract tweet ID from URL for display purposes
   * @param {string} url - Tweet URL
   * @returns {string} Tweet ID
   */
  extractTweetIdFromUrl(url) {
    const match = url.match(/\/status\/(\d+)/);
    return match ? match[1] : "unknown";
  }

  /**
   * Get application statistics
   * @returns {Object} Application stats
   */
  getStats() {
    return {
      totalTweets: this.uiManager.totalTweets,
      processedTweets: this.uiManager.processedTweets,
      results: this.uiManager.results,
    };
  }

  /**
   * Export results as JSON
   * @returns {string} JSON string of results
   */
  exportResults() {
    return JSON.stringify(this.uiManager.results, null, 2);
  }

  /**
   * Clear all data and reset the application
   */
  reset() {
    this.uiManager.resetProgress();
    this.uiManager.clearResults();
    document.getElementById("twitterLinks").value = "";
  }

  /**
   * Test backend connection
   * @returns {Promise<boolean>} True if backend is accessible
   */
  async testBackendConnection() {
    try {
      const serverInfo = await this.apiClient.getServerInfo();
      console.log("Backend server info:", serverInfo);
      return true;
    } catch (error) {
      console.error("Backend connection test failed:", error);
      return false;
    }
  }
}

// Initialize the app when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Make the app instance globally available for debugging
  window.replyGuyApp = new ReplyGuyApp();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ReplyGuyApp;
}
