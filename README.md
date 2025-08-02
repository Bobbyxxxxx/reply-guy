# Reply Guy - Twitter AI Reply Generator

A full-stack web application that processes Twitter links, extracts tweet content via Nitter, and generates AI-style replies using OpenAI.

## Features

- ✅ Process 50+ Twitter links at once
- ✅ Extract tweet IDs from various URL formats (twitter.com, x.com, nitter.net)
- ✅ Fetch tweet content using multiple Nitter instances
- ✅ Generate context-aware AI replies using OpenAI GPT-3.5
- ✅ Beautiful, responsive UI with loading states
- ✅ Error handling and graceful failure recovery
- ✅ Modular architecture for easy maintenance
- ✅ Backend API with Express.js
- ✅ Real AI integration with OpenAI

## Project Structure

```
reply-guy/
├── index.html          # Frontend HTML file
├── styles.css          # Frontend CSS styles
├── server.js           # Backend Express server
├── package.json        # Node.js dependencies
├── env.example         # Environment variables template
├── js/
│   ├── apiClient.js    # API communication module
│   ├── uiManager.js    # UI state management
│   └── app.js          # Main frontend application
└── README.md           # This file
```

## Quick Start

### 1. Backend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here

# Start the server
npm start
```

### 2. Frontend Setup

```bash
# Open index.html in your browser
# Or serve it with a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

## Backend API

### Server Endpoints

- `GET /` - Server status and info
- `POST /scrape` - Process Twitter links and generate replies

### POST /scrape Request

```json
{
  "links": [
    "https://twitter.com/username/status/1234567890",
    "https://x.com/username/status/0987654321"
  ]
}
```

### POST /scrape Response

```json
[
  {
    "url": "https://twitter.com/username/status/1234567890",
    "tweet": "This is the original tweet text...",
    "reply": "This is the AI-generated reply! 🤖"
  }
]
```

## Supported URL Formats

The application supports various Twitter URL formats:

- `https://twitter.com/username/status/1234567890`
- `https://x.com/username/status/1234567890`
- `https://nitter.net/username/status/1234567890`
- `https://any-nitter-instance.com/username/status/1234567890`

## AI Reply Features

The OpenAI integration includes:

- **Context-aware responses** based on tweet content
- **Casual, human-like tone** with emojis and Gen Z slang
- **Character limit compliance** (under 280 characters)
- **Temperature control** for creative but coherent replies
- **System prompts** for consistent personality

## Technical Details

### Backend Stack

- **Express.js** - Web server framework
- **CORS** - Cross-origin resource sharing
- **node-fetch** - HTTP client for scraping
- **cheerio** - HTML parsing and extraction
- **OpenAI SDK** - AI reply generation
- **dotenv** - Environment variable management

### Frontend Stack

- **Vanilla JavaScript** - No frameworks
- **Modular architecture** - Clean separation of concerns
- **Fetch API** - HTTP communication with backend
- **Modern CSS** - Responsive design with gradients

### Error Handling

- **Multiple Nitter instances** - Fallback if one fails
- **Rate limiting** - Respectful delays between requests
- **Graceful degradation** - Continue processing if some tweets fail
- **User feedback** - Clear error messages and status updates

### Security Features

- **CORS configuration** - Controlled cross-origin access
- **Input validation** - Sanitized URL processing
- **HTML escaping** - XSS prevention
- **Environment variables** - Secure API key storage

## Development

### Backend Development

```bash
# Development mode with auto-restart
npm run dev

# Check server status
curl http://localhost:3000/
```

### Frontend Development

```bash
# Test backend connection
window.replyGuyApp.testBackendConnection()

# Get current stats
window.replyGuyApp.getStats()

# Export results
window.replyGuyApp.exportResults()
```

### Environment Variables

Create a `.env` file with:

```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=development
```

## API Configuration

### OpenAI Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file
3. The server will use GPT-3.5-turbo for reply generation

### Nitter Instances

The backend tries multiple Nitter instances in order:

1. `https://nitter.net`
2. `https://nitter.it`
3. `https://nitter.unixfox.eu`
4. `https://nitter.privacydev.net`

## Troubleshooting

### Common Issues

1. **"Backend server not running"**

   - Ensure `npm start` is running
   - Check if port 3000 is available
   - Verify `.env` file exists with API key

2. **"Failed to scrape tweet"**

   - Nitter instances might be down
   - Try different Twitter URLs
   - Check network connectivity

3. **"OpenAI API error"**

   - Verify API key is correct
   - Check OpenAI account balance
   - Ensure API key has proper permissions

4. **CORS errors**
   - Backend CORS is configured for localhost
   - Check browser console for specific errors

### Debug Commands

```javascript
// Check server status
await window.replyGuyApp.apiClient.checkServerStatus();

// Test with sample URLs
const testUrls = ["https://twitter.com/username/status/1234567890"];
await window.replyGuyApp.apiClient.processTweets(testUrls);
```

## Future Enhancements

- [ ] User authentication and history
- [ ] Custom reply templates
- [ ] Batch processing with pause/resume
- [ ] Export results to CSV/JSON
- [ ] Multiple AI model support
- [ ] Tweet media handling
- [ ] Real-time processing status
- [ ] Advanced error recovery
- [ ] Rate limiting and caching
- [ ] Docker containerization

## License

This project is open source and available under the MIT License.
