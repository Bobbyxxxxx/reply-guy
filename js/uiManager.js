/**
 * UI Manager Module
 * Handles user interface updates and display logic
 */
class UIManager {
  constructor() {
    this.processedTweets = 0;
    this.totalTweets = 0;
    this.results = [];
  }

  /**
   * Show loading state
   */
  showLoading() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("processButton").disabled = true;
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("processButton").disabled = false;
  }

  /**
   * Update progress display
   */
  updateProgress() {
    this.processedTweets++;
    const progress = document.getElementById("progress");
    const percentage = Math.round(
      (this.processedTweets / this.totalTweets) * 100
    );
    progress.textContent = `Processed ${this.processedTweets} of ${this.totalTweets} tweets (${percentage}%)`;
  }

  /**
   * Display results in the UI
   */
  displayResults() {
    const resultsContainer = document.getElementById("results");
    const statsContainer = document.getElementById("stats");

    // Show stats
    statsContainer.innerHTML = `
      Processed ${this.processedTweets} tweets successfully
    `;
    statsContainer.classList.remove("hidden");

    // Clear previous results
    resultsContainer.innerHTML = "";

    // Display each tweet and reply
    this.results.forEach((result, index) => {
      const tweetCard = document.createElement("div");
      tweetCard.className = "tweet-card";

      tweetCard.innerHTML = `
        <div class="tweet-header">
          <span class="tweet-id">Tweet #${index + 1}</span>
          <span style="margin-left: 10px;">ID: ${result.tweetId}</span>
        </div>
        <div class="tweet-content">
          <div class="tweet-text">${this.escapeHtml(result.tweetText)}</div>
        </div>
        <div class="reply-section">
          <div class="reply-label">🤖 AI Reply:</div>
          <div class="reply-text">${this.escapeHtml(result.reply)}</div>
        </div>
      `;

      resultsContainer.appendChild(tweetCard);
    });
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    const resultsContainer = document.getElementById("results");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = message;
    resultsContainer.appendChild(errorDiv);
  }

  /**
   * Clear results display
   */
  clearResults() {
    document.getElementById("results").innerHTML = "";
    document.getElementById("stats").classList.add("hidden");
  }

  /**
   * Reset progress counters
   */
  resetProgress() {
    this.processedTweets = 0;
    this.totalTweets = 0;
    this.results = [];
  }

  /**
   * Add a result to the results array
   * @param {Object} result - Result object with tweetId, tweetText, and reply
   */
  addResult(result) {
    this.results.push(result);
  }

  /**
   * Set total tweets count
   * @param {number} total - Total number of tweets to process
   */
  setTotalTweets(total) {
    this.totalTweets = total;
  }

  /**
   * Get input value from textarea
   * @returns {string} The input text
   */
  getInputValue() {
    return document.getElementById("twitterLinks").value;
  }

  /**
   * Validate input and show appropriate error messages
   * @returns {boolean} True if input is valid
   */
  validateInput() {
    const linksText = this.getInputValue();
    if (!linksText.trim()) {
      alert("Please enter some Twitter links first!");
      return false;
    }
    return true;
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = UIManager;
}
