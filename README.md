# Reply Guy Backend

A Node.js/Express backend that generates casual replies to tweets using OpenAI's GPT API.

## Features

- Fetches tweet content from Nitter URLs
- Generates casual replies using OpenAI GPT-3.5-turbo
- Rate limiting with 1-second delays between requests
- Error handling for failed requests

## Local Development

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the project root:

   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Test the endpoint**
   Send a POST request to `http://localhost:3000/generate-replies`:
   ```json
   {
     "tweet_urls": ["https://nitter.net/username/status/1234567890"]
   }
   ```

## Render Deployment

1. **Connect your repository to Render**

   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository

2. **Configure environment variables**

   - In your Render dashboard, go to Environment
   - Add `OPENAI_API_KEY` with your API key

3. **Deploy**
   - Render will automatically detect the Node.js app
   - The `render.yaml` file provides the configuration
   - Your app will be available at `https://your-app-name.onrender.com`

## API Endpoints

- `GET /` - Health check
- `POST /generate-replies` - Generate replies for tweet URLs

## Response Format

```json
[
  {
    "tweet": "original tweet text",
    "reply": "gpt-generated reply"
  }
]
```

## Requirements

- Node.js 18+
- OpenAI API key
