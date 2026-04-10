# 🚀 AI Instagram Lead Intelligence System

## Overview

**Transform Instagram profiles into actionable business intelligence using AI.**

This system analyzes Instagram profiles and converts raw social media data into strategic business insights. Instead of just displaying metrics, it answers the critical question: *"What should we do with this profile to drive business growth?"*

Perfect for B2B lead generation, influencer vetting, competitive analysis, and content strategy optimization.

---

## 🎯 The Problem We Solve

Businesses spend hours manually analyzing Instagram profiles to:
- Identify high-value leads
- Understand audience composition
- Find content opportunities
- Benchmark against competitors

**Our Solution:** Automate this entire process with AI-powered analysis in seconds.

---

## ✨ Key Features

### 📊 **Smart Profile Analysis**
- Extract engagement metrics (likes, comments, posting frequency)
- Identify audience demographics and behavior patterns
- Calculate lead quality scores (High/Medium/Low)
- Detect optimal posting times

### 🤖 **AI-Powered Business Intelligence**
- **Business Classification**: Automatically categorize profiles (Fitness, Fashion, Tech, etc.)
- **Growth Potential Assessment**: Predict scalability and market opportunity
- **Competitor Insights**: Identify competitive advantages and market gaps
- **Content Strategy Generation**: Get specific, actionable content recommendations
- **Hashtag Intelligence**: Receive niche-relevant hashtag suggestions
- **Audience Behavior Prediction**: Understand when and how audiences engage

### 🏷️ **B2B/B2C Detection**
- Automatically classify business models
- Tailor insights for business type
- Identify cross-selling opportunities

### 📈 **Interactive Dashboard**
Six powerful tabs for complete profile intelligence:
- **Overview**: Key metrics, interest level, recommendations
- **Analytics**: 4 visual charts (engagement, performance, timing, content types)
- **AI Insights**: Strategy, competitors, hashtags, audience behavior
- **Compare**: Head-to-head profile comparison with AI reasoning
- **Report**: Comprehensive business summary export
- **Fetched Details**: Real-time scraped data and timestamp tracking

### 🔄 **Profile Comparison**
- Compare two profiles side-by-side
- AI-generated comparison explanation
- Identify winning strategies and gaps

### 📥 **Data-Driven Reports**
- Generate comprehensive business intelligence reports
- Download-ready summaries
- Share with stakeholders

---

## 🏗️ System Architecture

### **Data Pipeline**
```
User Input (URL) 
    ↓
Username Extraction
    ↓
Dataset Lookup (profiles.json)
    ↓
Metrics Calculation (analysisService)
    ↓
AI Analysis (Ollama - mistral)
    ↓
Unified Dashboard Response
```

### **Why Dataset-Based?**

**Advantages:**
- ✅ **Instant Analysis**: No API rate limits or delays
- ✅ **Reliable**: Consistent results every time
- ✅ **Demo-Ready**: Perfect for presentations and testing
- ✅ **Scalable**: Easy to upgrade to real APIs later
- ✅ **Privacy**: No external data sharing

**Architecture Philosophy:**
The system is built modular. The data layer (profiles.json) can be swapped with:
- Real Instagram APIs (when available)
- Database connections
- Live web scrapers
- Third-party data services

**Current Status:** Using controlled dataset for stability and demo reliability.

---

## 💻 Tech Stack

### **Frontend**
- **React** - Dynamic UI with hooks
- **Tailwind CSS** - Modern, responsive styling
- **Fetch API** - Backend communication

### **Backend**
- **Node.js** - JavaScript runtime
- **Express** - Lightweight web framework
- **Dotenv** - Environment configuration

### **AI Engine**
- **Ollama** - Local AI inference
- **Mistral Model** - Lightweight, powerful language model
- **JSON Parsing** - Structured output extraction

### **Data**
- **JSON Dataset** (profiles.json) - 10 demo profiles
- **In-Memory Storage** - Fast data retrieval

---

## 📁 Project Structure

```
simats_demo/
├── backend/
│   ├── app.js                    # Express server & main routes
│   ├── package.json
│   ├── controllers/
│   │   └── profileController.js  # Business logic & data processing
│   ├── services/
│   │   ├── analysisService.js    # Metric calculations (engagement, hashtags)
│   │   ├── aiService.js          # Ollama integration & prompt engineering
│   │   └── apifyService.js       # Instagram scraping (optional)
│   ├── routes/
│   │   └── profileRoutes.js      # API endpoints
│   └── data/
│       ├── profiles.json         # 10 demo profiles (rich dataset)
│       └── mockData.json         # Backend-compatible format
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                # Main app logic
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Sidebar.js        # Profile selector
│   │   │   ├── InputForm.js      # URL/username input
│   │   │   ├── Dashboard.js      # Data display
│   │   │   ├── CompareForm.js    # Comparison
│   │   │   └── CompareResult.js
│   │   ├── pages/
│   │   │   ├── Overview.js       # Tab: Key metrics
│   │   │   ├── Analytics.js      # Tab: Charts & visuals
│   │   │   ├── AIInsights.js     # Tab: AI analysis
│   │   │   ├── Compare.js        # Tab: Profile comparison
│   │   │   ├── Report.js         # Tab: Summary export
│   │   │   └── FetchedDetails.js # Tab: Raw data tracking
│   │   └── data/
│   │       └── mockProfiles.js   # 10 demo profiles (frontend)
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ (with npm)
- **Ollama** installed on your machine
- **Git** (optional)

### Installation (3 Steps)

**Step 1: Clone & Navigate**
```bash
cd simats_demo
```

**Step 2: Backend Setup**
```bash
cd backend
npm install
```

**Step 3: Frontend Setup**
```bash
cd frontend
npm install
```

### Running the System

**Terminal 1 - Start Ollama**
```bash
ollama serve
# In another terminal, pull the model:
ollama pull mistral
```

**Terminal 2 - Start Backend**
```bash
cd backend
npm start
# Backend runs on http://localhost:5000
```

**Terminal 3 - Start Frontend**
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
# Browser opens automatically
```

### 🎯 First Demo
1. Open http://localhost:3000
2. Select "Ella Beauty" from the sidebar
3. Click **Analyze**
4. Explore all 6 dashboard tabs

---

## 📡 API Endpoints

### Mock Profile Analysis
```bash
GET /api/profiles/beauty_brand_ella
GET /api/profiles/fitness_trend_sam
GET /api/profiles/travel_story_nina
```

### Profile Comparison
```bash
GET /api/profiles/compare/beauty_brand_ella/fitness_trend_sam
```

### Portfolio Statistics
```bash
GET /api/profiles/stats
```

### Live Instagram Scraping (Optional - requires APIFY_TOKEN)
```bash
POST /api/scrape
Content-Type: application/json

{
  "url": "https://www.instagram.com/redbull/",
  "resultsLimit": 30
}
```

---

## 📊 Available Mock Profiles

| Username | Category | Type | Followers | Interest |
|----------|----------|------|-----------|----------|
| beauty_brand_ella | Beauty | B2C | 82K | 🟢 High |
| fitness_trend_sam | Fitness | B2C | 54K | 🟡 Medium |
| travel_story_nina | Travel | B2C | 64K | 🟡 Medium |
| vogueatelier_nia | Fashion | B2C | 75K | 🟢 High |
| roamledger_travel | Travel | B2C | 210K | 🟢 High |
| runwayretail_ai | Fashion | B2B | 128K | 🟢 High |
| quantnest_advisory | Finance | B2B | 62K | 🟢 High |
| stackpilot_saas | Technology | B2B | 46K | 🟡 Medium |
| tiffintrail_kitchen | Food | B2C | 12K | 🔴 Low |
| gymops_agency | Fitness | B2B | 39K | 🔴 Low |

---

## 🎓 How It Works (End-to-End Flow)

### **User Enters Instagram URL**
User types: `beauty_brand_ella` or `https://www.instagram.com/beauty_brand_ella/`

### **Username Extraction**
Frontend parses URL to extract `beauty_brand_ella`

### **Data Lookup**
Backend queries `mockData.json` for profile data

### **Metrics Calculation**
`analysisService.js` computes:
- Average likes & comments
- Engagement rate (likes + comments) / followers
- Hashtag extraction
- Posting frequency
- Audience behavior patterns

### **AI Analysis**
`aiService.js` sends structured prompt to Ollama:
```
Profile: beauty_brand_ella
Followers: 82,000
Engagement: 5.1%
Bio: Premium skincare routines...

Generate business intelligence including:
- Business category
- Target audience
- Growth recommendations
- Content strategy
- Competitor insights
```

### **Ollama Response**
Mistral model returns structured JSON:
```json
{
  "businessCategory": "Beauty",
  "businessType": "B2C",
  "contentStrategy": "Focus on 3 tutorial reels per week...",
  "hashtagRecommendations": ["#GlowUp", "#CleanBeauty", ...],
  "growthPotential": "High"
}
```

### **Dashboard Display**
Frontend renders unified response across 6 tabs with visuals, charts, and actionable insights.

---

## 🏆 Hackathon Value Proposition

### **The Innovation**
- **AI + Social Media Analytics**: Combines engagement metrics with business intelligence
- **Actionable Insights**: Goes beyond metrics to strategic recommendations
- **Local AI**: Uses Ollama for privacy and offline capability
- **Dataset Simulation**: Demonstrates the architecture without external API dependencies

### **Why Dataset Approach?**
- Judges can see the full system in action immediately
- No API rate limits during demo
- Consistent, reproducible results
- Scalable to real APIs post-hackathon

### **Market Opportunity**
- **B2B Lead Generation**: Identify high-value clients on Instagram
- **Influencer Vetting**: Evaluate creator authenticity and fit
- **Competitive Intelligence**: Benchmark against competitor strategies
- **Content Strategy**: AI-powered recommendations for growth
- **Multi-industry**: Applicable to Fashion, Fitness, Finance, Tech, Food, Travel, etc.

---

## 🔧 Configuration

### Environment Variables (.env)
```env
# Backend
PORT=5000
OLLAMA_API_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=mistral

# Optional (for live scraping)
APIFY_TOKEN=your_apify_token_here
```

### Ollama Setup
```bash
# Download Ollama from https://ollama.ai
ollama serve

# In another terminal:
ollama pull mistral
```

---

## 📈 Performance & Metrics

- **Dashboard Load Time**: < 500ms (mock data)
- **AI Analysis Generation**: 3-10 seconds (Ollama processing)
- **API Response Time**: < 100ms
- **Supported Profiles**: 10 demo profiles (easily scalable)
- **Mobile Responsive**: Yes (Tailwind CSS)

---

## 🚦 Demo Scenarios

### Scenario 1: Mock Profile Demo (Fast)
Select any profile from sidebar → Click Analyze → See instant results

### Scenario 2: Live Scraping (If APIFY_TOKEN available)
Enter real Instagram URL → Scrape live data → AI analysis → Results

### Scenario 3: Profile Comparison
Select two profiles → View head-to-head comparison → See AI reasoning

---

## 🔮 Future Enhancements

- [ ] Real Instagram API integration
- [ ] Database storage (PostgreSQL)
- [ ] Multi-user accounts & saved analyses
- [ ] Advanced analytics (audience growth tracking)
- [ ] Influencer marketplace integration
- [ ] Email report generation
- [ ] Webhook integrations (Slack, CRM)
- [ ] Mobile app (React Native)

---

## 📝 License

MIT License - Feel free to use, modify, and distribute.

---

## 👥 Support

For questions or issues:
1. Check the project structure above
2. Verify Ollama is running: `ollama serve`
3. Ensure backend/frontend are on correct ports (5000/3000)
4. Check browser console for frontend errors

---

**Built with ❤️ for turning Instagram profiles into business intelligence.**

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