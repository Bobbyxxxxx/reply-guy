/**
 * UI Manager Module
 * Handles user interface updates and display logic
 */

// UI State
let uiState = {
  processedTweets: 0,
  totalTweets: 0,
  results: []
};

/**
 * Show loading state
 */
function showLoading() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("processButton").disabled = true;
}

/**
 * Hide loading state
 */
function hideLoading() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("processButton").disabled = false;
}

/**
 * Update progress display
 */
function updateProgress() {
  uiState.processedTweets++;
  const progress = document.getElementById("progress");
  const percentage = Math.round(
    (uiState.processedTweets / uiState.totalTweets) * 100
  );
  progress.textContent = `Processed ${uiState.processedTweets} of ${uiState.totalTweets} tweets (${percentage}%)`;
}

/**
 * Display results in the UI
 */
function displayResults() {
  const resultsContainer = document.getElementById("results");
  const statsContainer = document.getElementById("stats");

  // Show stats
  statsContainer.innerHTML = `
    Processed ${uiState.processedTweets} tweets successfully
  `;
  statsContainer.classList.remove("hidden");

  // Clear previous results
  resultsContainer.innerHTML = "";

  // Display each tweet and reply
  uiState.results.forEach((result, index) => {
    const tweetCard = document.createElement("div");
    tweetCard.className = "tweet-card";

    tweetCard.innerHTML = `
      <div class="tweet-header">
        <span class="tweet-id">Tweet #${index + 1}</span>
        <span style="margin-left: 10px;">ID: ${result.tweetId}</span>
      </div>
      <div class="tweet-content">
        <div class="tweet-text">${escapeHtml(result.tweetText)}</div>
      </div>
      <div class="reply-section">
        <div class="reply-label">AI Reply:</div>
        <div class="reply-text">${escapeHtml(result.reply)}</div>
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
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  const resultsContainer = document.getElementById("results");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error";
  errorDiv.textContent = message;
  resultsContainer.appendChild(errorDiv);
}

/**
 * Clear results display
 */
function clearResults() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("stats").classList.add("hidden");
}

/**
 * Reset progress counters
 */
function resetProgress() {
  uiState.processedTweets = 0;
  uiState.totalTweets = 0;
  uiState.results = [];
}

/**
 * Add a result to the results array
 * @param {Object} result - Result object with tweetId, tweetText, and reply
 */
function addResult(result) {
  uiState.results.push(result);
}

/**
 * Set total tweets count
 * @param {number} total - Total number of tweets to process
 */
function setTotalTweets(total) {
  uiState.totalTweets = total;
}

/**
 * Get input value from textarea
 * @returns {string} The input text
 */
function getInputValue() {
  return document.getElementById("twitterLinks").value;
}

/**
 * Validate input and show appropriate error messages
 * @returns {boolean} True if input is valid
 */
function validateInput() {
  const linksText = getInputValue();
  if (!linksText.trim()) {
    alert("Please enter some Twitter links first!");
    return false;
  }
  return true;
}

/**
 * Get current UI state
 * @returns {Object} Current UI state
 */
function getUIState() {
  return { ...uiState };
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    showLoading,
    hideLoading,
    updateProgress,
    displayResults,
    escapeHtml,
    showError,
    clearResults,
    resetProgress,
    addResult,
    setTotalTweets,
    getInputValue,
    validateInput,
    getUIState
  };
}
