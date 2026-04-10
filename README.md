# AI Instagram Lead Intelligence System

## Project Description

This is a web application that converts Instagram profiles into actionable business intelligence. Instead of just displaying analytics, it answers: "What should a business do with this profile?"

## Problem Statement

Businesses struggle to identify valuable Instagram leads and understand actionable next steps from profile data. This system provides AI-powered insights to turn social media profiles into business opportunities.

## Proposed Solution

A full-stack web app with:
- Instagram profile URL scraping through Apify
- Post-level data processing for engagement, hashtags, and posting cadence
- AI analysis using local Ollama models for business classification and recommendations
- Clean dashboard UI with lead scoring and actionable insights
- Profile comparison feature

## Features

- **Profile Scraping**: Input an Instagram profile URL and fetch public post data through Apify
- **Profile Analysis**: Use the scraped profile data to generate engagement metrics and business intelligence
- **Lead Scoring**: High/Medium/Low based on engagement
- **AI Insights**: Business classification, growth potential, recommended actions
- **Tagging System**: Extract keywords from captions and bios
- **Profile Comparison**: Compare two profiles with AI explanation
- **Modern UI**: Clean SaaS-style dashboard with Tailwind CSS

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Scraping**: Apify Instagram Scraper API
- **AI**: Ollama (`mistral` by default)
- **Data**: Mock JSON dataset plus scraped Instagram post data

## Data Source

This project uses a structured mock dataset (`profiles.json`) to simulate Instagram profile data.

Due to API and scraping limitations, a controlled dataset approach is used.

The system architecture is designed to be modular:

- The data layer can be replaced with real APIs or scrapers in production.
- The current dataset enables stable AI analysis and demo reliability.

Pipeline:
User Input -> Data Service -> Analysis Service -> AI (Ollama) -> Dashboard

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Ollama installed locally

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file in backend directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   APIFY_TOKEN=your_apify_api_token_here
   OLLAMA_MODEL=mistral
   OLLAMA_API_URL=http://localhost:11434/api/generate
   ```
4. Start Ollama and pull a model:
   ```bash
   ollama pull mistral
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

## How to Run

1. Start the backend server (runs on http://localhost:5000)
2. Start the frontend (runs on http://localhost:3000)
3. Open http://localhost:3000 in your browser
4. Enter an Instagram profile URL for scraping or a mock username for the dashboard flows
5. Click "Analyze" to see the dashboard

## API Endpoints

- `POST /api/scrape` - accepts `{ "url": "https://www.instagram.com/<profile>/" }` and returns profile details, posts, analytics, and AI insights in a single response
- `GET /api/profiles/:username` - returns profile analysis, engagement metrics, tags, and Ollama AI analysis
- `GET /api/profiles/compare/:username1/:username2` - returns two profile payloads and a comparison explanation
- `GET /api/profiles/stats` - returns portfolio-level summary metrics from the mock dataset

## End-to-End Analyze Flow

1. Frontend sends user input (URL or username) to `POST /api/scrape`.
2. Backend calls Apify Instagram Scraper to fetch latest public posts.
3. Backend computes metrics (average likes/comments, hashtags, posting frequency, engagement rate).
4. Backend sends profile summary to Ollama for business intelligence insights.
5. Frontend receives one unified payload with `profile`, `posts`, `analysis`, and `aiAnalysis`.

Example scrape response shape:

```json
{
   "success": true,
   "profile": {
      "username": "example_user",
      "followers": 12345,
      "bio": "..."
   },
   "posts": [],
   "analysis": {
      "avgLikes": 0,
      "avgComments": 0,
      "hashtags": [],
      "postingFrequency": 0,
      "engagementRate": 0
   },
   "aiAnalysis": {
      "businessCategory": "...",
      "recommendedAction": "..."
   },
   "meta": {
      "totalPosts": 0,
      "source": "Apify Instagram Scraper"
   }
}
```

## How AI Works

The system uses Ollama with a strict JSON prompt to analyze Instagram profiles. The AI:

1. Receives profile data (username, followers, engagement, bio, tags)
2. Classifies the business type (fitness, fashion, tech, etc.)
3. Generates key insights about the profile's value
4. Assesses growth potential (High/Medium/Low)
5. Provides specific recommended actions for businesses

Example prompt structure:
```
Provide strict JSON only with businessClassification, keyInsights, growthPotential, recommendedAction.
Do not include markdown or extra explanation.
```

## Demo Explanation

### Sample Profiles
The app includes 7 mock profiles:
- fitness_guru_john (Fitness)
- fashionista_sarah (Fashion)
- tech_startup_alex (Tech/SaaS)
- foodie_maria (Food)
- travel_adventurer_mike (Travel)
- beauty_expert_lisa (Beauty)
- artist_david (Art)

### Demo Flow
1. Enter an Instagram profile URL for scraping or a mock username for profile analysis
2. The backend sends the URL to Apify's Instagram Scraper API
3. Scraped posts are normalized and cleaned
4. The backend calculates average likes, average comments, hashtag frequency, posting frequency, and engagement rate
5. The response includes structured profile details, raw posts, and analysis output
6. The dashboard displays all insights

### Comparison Feature
- Enter two usernames
- See side-by-side metrics
- Get AI explanation of differences

## Future Scope

- Real Instagram API integration
- User authentication and saved analyses
- Advanced analytics and trends
- Export reports
- Mobile app version
- Integration with CRM systems

## Project Structure

```
/
├── backend/
│   ├── app.js
│   ├── controllers/
│   │   └── profileController.js
│   ├── data/
│   │   └── mockData.json
│   ├── routes/
│   │   └── profileRoutes.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── analysisService.js
│   │   └── apifyService.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputForm.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CompareForm.js
│   │   │   └── CompareResult.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   └── Compare.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```

## Contributing

This is a demo project. For improvements, feel free to fork and enhance.

## License

MIT License