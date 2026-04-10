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

app.post("/api/scrape", async (req, res) => {
  const { url, resultsLimit } = req.body || {};

  if (!isInstagramUrl(url)) {
    return res.status(400).json({
      success: false,
      error: 'A valid Instagram profile URL is required',
    });
  }

  try {
    // FIX: extract username from URL for Apify
    const username = url.replace(/\/$/, '').split('/').pop();
    const posts = await runApify(username, { resultsLimit });

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No public posts were returned. The profile may be private, empty, or unavailable.',
      });
    }

    const profile = buildProfileDetails(posts, url);
    const followers = profile.followers || 0;

    const analysis = analyzeData(posts, followers);

    const aiInput = {
      username: profile.username || null,
      followers,
      engagementRate: analysis.engagementRate,
      bio: profile.bio || '',
      tags: analysis.hashtags || [],
    };
    const aiAnalysis = await getAIInsights(aiInput);

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
    console.error('Error:', error);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;