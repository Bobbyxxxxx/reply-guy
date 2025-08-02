/**
 * Reply Generator Module
 * Handles AI-style reply generation for tweets
 */
class ReplyGenerator {
  constructor() {
    this.replies = [
      "Interesting take! 🤔",
      "Thanks for sharing this perspective! 👍",
      "This is really thought-provoking. 💭",
      "Great point! I hadn't considered that angle. 👏",
      "Appreciate you bringing this up! 🙏",
      "This resonates with me. ✨",
      "Well said! 🎯",
      "Thanks for the insight! 💡",
      "This is exactly what I needed to hear today! 🌟",
      "You've got a point there! 🔥",
    ];
  }

  /**
   * Generate an AI-style reply based on tweet content
   * @param {string} tweetText - The original tweet text
   * @returns {string} The generated reply
   */
  generateReply(tweetText) {
    // Simple logic to generate different replies based on content
    const wordCount = tweetText.split(" ").length;
    const hasQuestion = tweetText.includes("?");
    const hasExclamation = tweetText.includes("!");
    const hasEmoji =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
        tweetText
      );

    // Context-aware reply generation
    if (hasQuestion) {
      return "That's a great question! I'd love to hear more about your thoughts on this. 🤔";
    } else if (hasExclamation) {
      return "Love the energy! 🔥 This is exactly the kind of content we need more of.";
    } else if (wordCount > 50) {
      return "Thanks for taking the time to share such a detailed perspective! 🙏";
    } else if (hasEmoji) {
      return "Love the vibes! ✨ Your energy is contagious.";
    } else if (
      this.containsKeywords(tweetText, [
        "tech",
        "technology",
        "coding",
        "programming",
      ])
    ) {
      return "Fascinating tech insight! 💻 Always love learning from the community.";
    } else if (
      this.containsKeywords(tweetText, ["business", "startup", "entrepreneur"])
    ) {
      return "Great business perspective! 🚀 The hustle is real.";
    } else {
      return this.replies[Math.floor(Math.random() * this.replies.length)];
    }
  }

  /**
   * Check if tweet contains specific keywords
   * @param {string} text - The tweet text
   * @param {string[]} keywords - Keywords to search for
   * @returns {boolean} True if any keyword is found
   */
  containsKeywords(text, keywords) {
    const lowerText = text.toLowerCase();
    return keywords.some((keyword) =>
      lowerText.includes(keyword.toLowerCase())
    );
  }

  /**
   * Generate a more sophisticated reply using sentiment analysis
   * @param {string} tweetText - The original tweet text
   * @returns {string} The generated reply
   */
  generateAdvancedReply(tweetText) {
    const sentiment = this.analyzeSentiment(tweetText);

    switch (sentiment) {
      case "positive":
        return "Love the positive vibes! 🌟 Your optimism is contagious.";
      case "negative":
        return "I hear you, and your feelings are valid. 💙 Sometimes we all need to vent.";
      case "neutral":
        return "Thanks for sharing your thoughts! 💭 Always appreciate different perspectives.";
      default:
        return this.generateReply(tweetText);
    }
  }

  /**
   * Simple sentiment analysis
   * @param {string} text - The text to analyze
   * @returns {string} 'positive', 'negative', or 'neutral'
   */
  analyzeSentiment(text) {
    const positiveWords = [
      "love",
      "great",
      "amazing",
      "awesome",
      "fantastic",
      "wonderful",
      "excellent",
      "good",
      "happy",
      "excited",
    ];
    const negativeWords = [
      "hate",
      "terrible",
      "awful",
      "horrible",
      "bad",
      "sad",
      "angry",
      "frustrated",
      "disappointed",
      "upset",
    ];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter((word) =>
      lowerText.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerText.includes(word)
    ).length;

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ReplyGenerator;
}
