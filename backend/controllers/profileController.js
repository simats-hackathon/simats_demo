const mockData = require('../data/mockData.json');
const { getAIInsights } = require('../services/aiService');

const USERNAME_PATTERN = /^[A-Za-z0-9_.]+$/;

const isValidUsername = (username) => typeof username === 'string' && USERNAME_PATTERN.test(username);

const calculateMetrics = (profile) => {
  const followers = Number(profile.followers) || 0;
  const likes = Number(profile.avg_likes) || 0;
  const comments = Number(profile.avg_comments) || 0;
  const engagementRate = followers > 0 ? ((likes + comments) / followers) * 100 : 0;

  let leadScore = 'Low';
  if (engagementRate > 5) leadScore = 'High';
  else if (engagementRate > 2) leadScore = 'Medium';

  const tags = typeof profile.bio === 'string' ? profile.bio.match(/#\w+/g) || [] : [];

  return {
    engagementRate: parseFloat(engagementRate.toFixed(2)),
    leadScore,
    tags,
  };
};

const getProfileAnalysis = async (req, res) => {
  try {
    const { username } = req.params;

    if (!isValidUsername(username)) {
      return res.status(400).json({ error: 'Invalid username format' });
    }

    const profile = mockData.find((p) => p.username === username);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const metrics = calculateMetrics(profile);
    const aiAnalysis = await getAIInsights({ ...profile, ...metrics });

    return res.json({
      ...profile,
      ...metrics,
      aiAnalysis,
    });
  } catch (error) {
    console.error('getProfileAnalysis error:', error);
    return res.status(500).json({
      error: 'Unable to analyze profile at this time',
      aiAnalysis: {
        businessClassification: 'Unknown',
        keyInsights: ['Unable to generate AI insights'],
        growthPotential: 'Unknown',
        recommendedAction: 'Please try again later',
      },
    });
  }
};

const compareProfiles = async (req, res) => {
  try {
    const { username1, username2 } = req.params;

    if (!isValidUsername(username1) || !isValidUsername(username2)) {
      return res.status(400).json({ error: 'Invalid username format' });
    }

    const profile1 = mockData.find((p) => p.username === username1);
    const profile2 = mockData.find((p) => p.username === username2);

    if (!profile1 || !profile2) {
      return res.status(404).json({ error: 'One or both profiles not found' });
    }

    const metrics1 = calculateMetrics(profile1);
    const metrics2 = calculateMetrics(profile2);

    const response1 = { ...profile1, ...metrics1 };
    const response2 = { ...profile2, ...metrics2 };

    const explanation =
      response1.engagementRate >= response2.engagementRate
        ? `${response1.username} has stronger current engagement and lead potential.`
        : `${response2.username} has stronger current engagement and lead potential.`;

    return res.json({
      profile1: response1,
      profile2: response2,
      explanation,
    });
  } catch (error) {
    console.error('compareProfiles error:', error);
    return res.status(500).json({ error: 'Unable to compare profiles at this time' });
  }
};

module.exports = { getProfileAnalysis, compareProfiles };