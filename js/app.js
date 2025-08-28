/**
 * Main Application Module
 * Orchestrates all components and handles the main application logic
 */

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
  const processButton = document.getElementById("processButton");
  processButton.addEventListener("click", () => handleProcessTweets());
}

/**
 * Check if backend server is running
 */
async function checkAppServerStatus() {
  try {
    const isRunning = await checkServerStatus();
    if (!isRunning) {
      showError(
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
function extractTweetUrls(linksText) {
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
 * Main function to process tweets via backend API
 */
async function handleProcessTweets() {
  // Validate input
  if (!validateInput()) {
    return;
  }

  const linksText = getInputValue();
  const urls = extractTweetUrls(linksText);

  if (urls.length === 0) {
    alert("No valid Twitter links found. Please check your input!");
    return;
  }

  // Setup UI state
  setTotalTweets(urls.length);
  resetProgress();
  showLoading();
  clearResults();

  try {
    console.log(`Sending ${urls.length} URLs to backend for processing`);

    // Send all URLs to backend for processing
    const results = await processTweets(urls);

    console.log("Received results from backend:", results);

    // Process results and update UI
    results.forEach((result, index) => {
      addResult({
        tweetId: extractTweetIdFromUrl(result.url),
        tweetText: result.tweet,
        reply: result.reply,
      });

      // Update progress for each result
      updateProgress();
    });

    // Display results
    displayResults();
  } catch (error) {
    console.error("Error processing tweets:", error);
    showError(
      `Failed to process tweets: ${error.message}. Please ensure the backend server is running.`
    );
  } finally {
    hideLoading();
  }
}

/**
 * Extract tweet ID from URL for display purposes
 * @param {string} url - Tweet URL
 * @returns {string} Tweet ID
 */
function extractTweetIdFromUrl(url) {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : "unknown";
}

/**
 * Get application statistics
 * @returns {Object} Application stats
 */
function getAppStats() {
  const uiState = getUIState();
  return {
    totalTweets: uiState.totalTweets,
    processedTweets: uiState.processedTweets,
    results: uiState.results,
  };
}

/**
 * Export results as JSON
 * @returns {string} JSON string of results
 */
function exportResults() {
  const uiState = getUIState();
  return JSON.stringify(uiState.results, null, 2);
}

/**
 * Clear all data and reset the application
 */
function resetApp() {
  resetProgress();
  clearResults();
  document.getElementById("twitterLinks").value = "";
}

/**
 * Test backend connection
 * @returns {Promise<boolean>} True if backend is accessible
 */
async function testBackendConnection() {
  try {
    const serverInfo = await getServerInfo();
    console.log("Backend server info:", serverInfo);
    return true;
  } catch (error) {
    console.error("Backend connection test failed:", error);
    return false;
  }
}

/**
 * Initialize the application
 */
function initializeApp() {
  initializeEventListeners();
  checkAppServerStatus();
}

// Initialize the app when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  
  // Make functions globally available for debugging
  window.replyGuyApp = {
    handleProcessTweets,
    extractTweetUrls,
    extractTweetIdFromUrl,
    getAppStats,
    exportResults,
    resetApp,
    testBackendConnection
  };
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializeApp,
    handleProcessTweets,
    extractTweetUrls,
    extractTweetIdFromUrl,
    getAppStats,
    exportResults,
    resetApp,
    testBackendConnection
  };
}
