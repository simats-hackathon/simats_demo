const { runApify } = require('../services/apifyService');
const { analyzeProfile, classifyBusiness } = require('../services/analysisService');
const { generateAIInsights } = require('../services/aiService');
const path = require('path');
const fs = require('fs');

// Load backup CSV data if live scraping fails
const loadBackupData = (username) => {
  try {
    const backupPath = path.join(__dirname, '../data', `backup_${username}.json`);
    if (fs.existsSync(backupPath)) {
      const raw = fs.readFileSync(backupPath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[Backup] Could not load backup data:', err.message);
  }
  return null;
};

const analyzeInstagram = async (req, res) => {
  const { url, resultsLimit } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Instagram URL is required' });
  }

  try {
    let posts = [];
    let profileInfo = {};
    let usedBackup = false;

    // Try live scraping first
    try {
      const rawData = await runApify(url, { resultsLimit: resultsLimit || 30 });
      posts = rawData;

      // Extract profile info from first item
      if (rawData.length > 0) {
        const first = rawData[0];
        profileInfo = {
          username: first.ownerUsername || first.username || '',
          followersCount: first.ownerFollowersCount || first.followersCount || 0,
          biography: first.biography || '',
          businessCategoryName: first.businessCategoryName || '',
          isBusinessAccount: first.isBusinessAccount || false,
          postsCount: first.postsCount || rawData.length,
          fullName: first.ownerFullName || first.fullName || '',
        };
      }
    } catch (scrapeError) {
      console.warn('[Scraper] Live scraping failed, trying backup:', scrapeError.message);

      // Extract username from URL for backup lookup
      const urlParts = url.replace(/\/$/, '').split('/');
      const username = urlParts[urlParts.length - 1];
      const backup = loadBackupData(username);

      if (backup) {
        posts = backup.posts || [];
        profileInfo = backup.profileInfo || {};
        usedBackup = true;
      } else {
        return res.status(scrapeError.status || 500).json({
          error: scrapeError.message || 'Failed to fetch Instagram data',
          suggestion: 'Try again or check the URL',
        });
      }
    }

    // Run analysis
    const analysisResult = analyzeProfile(posts, profileInfo);

    // Classify business
    const classification = classifyBusiness(profileInfo, analysisResult);

    // Generate AI insights
    const aiInsights = await generateAIInsights(profileInfo, analysisResult, posts);

    // Final response
    return res.status(200).json({
      success: true,
      usedBackup,
      profileInfo,
      analysis: analysisResult,
      classification,
      aiInsights,
      postsAnalyzed: posts.length,
    });
  } catch (err) {
    console.error('[Controller] Unexpected error:', err);
    return res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  }
};

const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Instagram Analyzer API is running',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { analyzeInstagram, healthCheck };