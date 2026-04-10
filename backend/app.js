const express = require('express');
const cors = require('cors');
require('dotenv').config();

const profileRoutes = require('./routes/profileRoutes');
const { runApify } = require('./services/apifyService');
const { analyzeData } = require('./services/analysisService');
const { getAIInsights } = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// existing routes (keep this as it is)
app.use('/api/profiles', profileRoutes);

const isInstagramUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    return false;
  }

  try {
    const parsedUrl = new URL(value.trim());
    const hostname = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();
    return hostname === 'instagram.com';
  } catch {
    return false;
  }
};

const buildProfileDetails = (posts, sourceUrl) => {
  const firstPost = posts[0] || {};
  const owner = firstPost.owner || {};

  return {
    username: firstPost.ownerUsername || owner.username || null,
    fullName: firstPost.ownerFullName || owner.fullName || null,
    bio: firstPost.ownerBiography || owner.biography || null,
    followers: Number(firstPost.ownerFollowersCount || owner.followersCount || 0) || 0,
    isPrivate: Boolean(firstPost.isPrivate ?? owner.isPrivate ?? false),
    sourceUrl,
  };
};

// 🔥 MAIN SCRAPE + ANALYZE ROUTE
app.post("/api/scrape", async (req, res) => {
  const { url, resultsLimit } = req.body || {};
  console.log('🔥 [Scrape] Incoming request body:', req.body || {});
  console.log('🌐 [Scrape] Received URL:', url || null);

  if (!isInstagramUrl(url)) {
    return res.status(400).json({
      success: false,
      error: 'A valid Instagram profile URL is required',
    });
  }

  try {
    // Step 1: Get posts data from Apify
    const posts = await runApify(url, { resultsLimit });
    console.log('📦 [Scrape] Scraped data from Apify:', {
      postCount: Array.isArray(posts) ? posts.length : 0,
      preview: Array.isArray(posts) ? posts.slice(0, 2) : [],
    });

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No public posts were returned. The profile may be private, empty, or unavailable.',
      });
    }

    const profile = buildProfileDetails(posts, url);
    const followers = profile.followers || 0;

    // Step 3: Analyze metrics from scraped posts
    const analysis = analyzeData(posts, followers);
    console.log('📊 [Scrape] Processed analysis output:', analysis);

    // Step 4: Enrich with AI business insights
    const aiInput = {
      username: profile.username || null,
      followers,
      engagementRate: analysis.engagementRate,
      bio: profile.bio || '',
      tags: analysis.hashtags || [],
    };
    const aiAnalysis = await getAIInsights(aiInput);
    console.log('🤖 [Scrape] AI analysis output:', aiAnalysis);

    // Step 5: Send unified response
    return res.json({
      success: true,
      profile,
      posts,
      analysis,
      aiAnalysis,
      meta: {
        totalPosts: posts.length,
        source: 'Apify Instagram Scraper',
      },
    });

  } catch (error) {
    console.error('❌ [Scrape] Error while processing /api/scrape:', {
      message: error?.message,
      status: error?.status || 500,
      details: error?.details,
      stack: error?.stack,
    });

    const status = error.status || 500;
    const message = status === 400 || status === 404
      ? error.message
      : 'Something went wrong while scraping Instagram data';

    return res.status(status).json({
      success: false,
      error: message,
      ...(error.details ? { details: error.details } : {}),
    });
  }
});

app.use((error, req, res, next) => {
  if (error && error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON body',
    });
  }

  return next(error);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});