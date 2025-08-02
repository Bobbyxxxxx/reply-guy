/**
 * API Client Module
 * Handles communication with the backend server
 */
class ApiClient {
  constructor(baseURL = "http://localhost:3000") {
    this.baseURL = baseURL;
  }

  /**
   * Send Twitter links to backend for processing
   * @param {string[]} links - Array of Twitter URLs
   * @returns {Promise<Array>} Array of processed results
   */
  async processTweets(links) {
    try {
      const response = await fetch(`${this.baseURL}/scrape`, {
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
   * @returns {Promise<boolean>} True if server is available
   */
  async checkServerStatus() {
    try {
      const response = await fetch(`${this.baseURL}/`);
      return response.ok;
    } catch (error) {
      console.error("Server status check failed:", error);
      return false;
    }
  }

  /**
   * Get server info
   * @returns {Promise<Object>} Server information
   */
  async getServerInfo() {
    try {
      const response = await fetch(`${this.baseURL}/`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.error("Failed to get server info:", error);
      throw error;
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ApiClient;
}
