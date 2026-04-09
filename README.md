# AI Instagram Lead Intelligence System

## Project Description

This is a web application that converts Instagram profiles into actionable business intelligence. Instead of just displaying analytics, it answers: "What should a business do with this profile?"

## Problem Statement

Businesses struggle to identify valuable Instagram leads and understand actionable next steps from profile data. This system provides AI-powered insights to turn social media profiles into business opportunities.

## Proposed Solution

A full-stack web app with:
- Input system for Instagram usernames
- Mock data processing for engagement metrics
- AI analysis using Google Gemini for business classification and recommendations
- Clean dashboard UI with lead scoring and actionable insights
- Profile comparison feature

## Features

- **Profile Analysis**: Input username, get comprehensive business intelligence
- **Lead Scoring**: High/Medium/Low based on engagement
- **AI Insights**: Business classification, growth potential, recommended actions
- **Tagging System**: Extract keywords from bio
- **Profile Comparison**: Compare two profiles with AI explanation
- **Modern UI**: Clean SaaS-style dashboard with Tailwind CSS

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: Google Gemini (`gemini-1.5-flash`)
- **Data**: Mock JSON dataset

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

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
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```
4. Start the backend server:
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
4. Enter an Instagram username from the mock data (e.g., fitness_guru_john)
5. Click "Analyze" to see the dashboard

## API Endpoints

- `GET /api/profiles/:username` - returns profile analysis, engagement metrics, tags, and Gemini AI analysis
- `GET /api/profiles/compare/:username1/:username2` - returns two profile payloads and a comparison explanation

## How AI Works

The system uses Google Gemini (`gemini-1.5-flash`) with a strict JSON prompt to analyze Instagram profiles. The AI:

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
1. Enter username (e.g., "tech_startup_alex")
2. System fetches mock data
3. Calculates engagement rate: (avg_likes + avg_comments) / followers
4. Determines lead score based on engagement
5. Extracts tags from bio
6. Calls Gemini API for AI analysis
7. Displays dashboard with all insights

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
├── backend/
│   ├── routes/
│   │   └── profileRoutes.js
│   ├── controllers/
│   │   └── profileController.js
│   ├── services/
│   │   └── aiService.js
│   ├── data/
│   │   └── mockData.json
│   ├── app.js
│   └── package.json
└── README.md
```

## Contributing

This is a demo project. For improvements, feel free to fork and enhance.

## License

MIT License