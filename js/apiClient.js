/**
 * API Client Module
 * Handles communication with the backend server
 */

// Configuration
const API_CONFIG = {
  baseURL: "http://localhost:3000"
};

/**
 * Send Twitter links to backend for processing
 * @param {string[]} links - Array of Twitter URLs
 * @param {string} baseURL - Optional base URL override
 * @returns {Promise<Array>} Array of processed results
 */
async function processTweets(links, baseURL = API_CONFIG.baseURL) {
  try {
    const response = await fetch(`${baseURL}/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ links }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * Check if the backend server is running
 * @param {string} baseURL - Optional base URL override
 * @returns {Promise<boolean>} True if server is available
 */
async function checkServerStatus(baseURL = API_CONFIG.baseURL) {
  try {
    const response = await fetch(`${baseURL}/`);
    return response.ok;
  } catch (error) {
    console.error("Server status check failed:", error);
    return false;
  }
}

/**
 * Get server info
 * @param {string} baseURL - Optional base URL override
 * @returns {Promise<Object>} Server information
 */
async function getServerInfo(baseURL = API_CONFIG.baseURL) {
  try {
    const response = await fetch(`${baseURL}/`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.error("Failed to get server info:", error);
    throw error;
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    processTweets,
    checkServerStatus,
    getServerInfo,
    API_CONFIG
  };
}
