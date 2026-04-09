const mockData = require('../data/mockData.json');
const { analyzeProfile } = require('../services/aiService');

const getProfileAnalysis = async (req, res) => {
  const { username } = req.params;
  const profile = mockData.find(p => p.username === username);

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  // Calculate engagement rate
  const engagementRate = ((profile.avg_likes + profile.avg_comments) / profile.followers) * 100;

  // Lead scoring
  let leadScore = 'Low';
  if (engagementRate > 5) leadScore = 'High';
  else if (engagementRate > 2) leadScore = 'Medium';

  // Generate tags from bio
  const tags = profile.bio.match(/#\w+/g) || [];

  // AI Analysis
  const aiAnalysis = await analyzeProfile(profile);

  res.json({
    ...profile,
    engagementRate: engagementRate.toFixed(2),
    leadScore,
    tags,
    aiAnalysis,
  });
};

const compareProfiles = async (req, res) => {
  const { username1, username2 } = req.params;
  const profile1 = mockData.find(p => p.username === username1);
  const profile2 = mockData.find(p => p.username === username2);

  if (!profile1 || !profile2) {
    return res.status(404).json({ error: 'One or both profiles not found' });
  }

  // Calculate for both
  const calcMetrics = (p) => {
    const engagementRate = ((p.avg_likes + p.avg_comments) / p.followers) * 100;
    let leadScore = 'Low';
    if (engagementRate > 5) leadScore = 'High';
    else if (engagementRate > 2) leadScore = 'Medium';
    return { engagementRate: engagementRate.toFixed(2), leadScore };
  };

  const metrics1 = calcMetrics(profile1);
  const metrics2 = calcMetrics(profile2);

  const difference = (metrics1.engagementRate - metrics2.engagementRate).toFixed(2);

  // Simple AI explanation
  const explanation = difference > 0 ? `${username1} has higher engagement due to better content strategy.` : `${username2} performs better with stronger audience interaction.`;

  res.json({
    profile1: { ...profile1, ...metrics1 },
    profile2: { ...profile2, ...metrics2 },
    difference,
    explanation,
  });
};

module.exports = { getProfileAnalysis, compareProfiles };