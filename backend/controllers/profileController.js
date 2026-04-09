const mockData = require('../data/mockData.json');
const { getAIInsights } = require('../services/aiService');

const USERNAME_PATTERN = /^[A-Za-z0-9_.]+$/;

const isValidUsername = (username) => typeof username === 'string' && USERNAME_PATTERN.test(username);

const inferCategoryFromProfile = (profile, tags) => {
  const text = `${profile.bio || ''} ${(tags || []).join(' ')}`.toLowerCase();
  if (/fitness|health|wellness|yoga|workout/.test(text)) return 'Fitness & Wellness';
  if (/fashion|style|ootd|beauty|makeup|skincare/.test(text)) return 'Fashion & Beauty';
  if (/tech|startup|saas|coding|webdev|gadget/.test(text)) return 'Tech & Startups';
  if (/food|cooking|recipe|chef/.test(text)) return 'Food & Culinary';
  if (/travel|adventure|photography|streetphoto/.test(text)) return 'Travel & Photography';
  if (/finance|investing|money/.test(text)) return 'Finance';
  if (/realestate|property|homes/.test(text)) return 'Real Estate';
  if (/art|illustration|design|creator|dance/.test(text)) return 'Creative';
  if (/education|science|mentor|learning/.test(text)) return 'Education';
  return 'General Creator';
};

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
        businessCategory: 'Unknown',
        businessType: 'Unknown',
        audienceType: 'Unknown',
        tags: [],
        description: 'AI unavailable',
        keyInsights: ['AI unavailable'],
        strengths: ['AI unavailable'],
        weaknesses: ['AI unavailable'],
        growthPotential: 'Unknown',
        recommendedAction: 'Retry analysis',
        competitorInsights: 'Unavailable',
        contentStrategy: 'Unavailable',
        hashtagRecommendations: [],
        audienceBehavior: 'Unavailable',
        whyThisWorks: ['Unavailable'],
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

    const aiAnalysis1 = await getAIInsights({ ...profile1, ...metrics1 });
    const aiAnalysis2 = await getAIInsights({ ...profile2, ...metrics2 });

    const response1 = { ...profile1, ...metrics1, aiAnalysis: aiAnalysis1 };
    const response2 = { ...profile2, ...metrics2, aiAnalysis: aiAnalysis2 };

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

const getPortfolioStats = async (req, res) => {
  try {
    const profilesWithMetrics = mockData.map((profile) => {
      const metrics = calculateMetrics(profile);
      return { ...profile, ...metrics };
    });

    const totalProfiles = profilesWithMetrics.length;
    const totalFollowers = profilesWithMetrics.reduce((sum, p) => sum + (Number(p.followers) || 0), 0);
    const avgEngagementRate =
      totalProfiles > 0
        ? parseFloat(
            (
              profilesWithMetrics.reduce((sum, p) => sum + (Number(p.engagementRate) || 0), 0) / totalProfiles
            ).toFixed(2)
          )
        : 0;

    const leadScoreBreakdown = profilesWithMetrics.reduce(
      (acc, p) => {
        acc[p.leadScore] = (acc[p.leadScore] || 0) + 1;
        return acc;
      },
      { High: 0, Medium: 0, Low: 0 }
    );

    const categoryCounts = profilesWithMetrics.reduce((acc, p) => {
      const category = inferCategoryFromProfile(p, p.tags);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const topCategory =
      Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General Creator';

    const topLeadCandidates = profilesWithMetrics
      .slice()
      .sort((a, b) => {
        const scoreRank = { High: 3, Medium: 2, Low: 1 };
        const scoreDiff = (scoreRank[b.leadScore] || 0) - (scoreRank[a.leadScore] || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return (Number(b.engagementRate) || 0) - (Number(a.engagementRate) || 0);
      })
      .slice(0, 5)
      .map((p) => ({
        username: p.username,
        followers: p.followers,
        engagementRate: p.engagementRate,
        leadScore: p.leadScore,
        category: inferCategoryFromProfile(p, p.tags),
      }));

    return res.json({
      totalProfiles,
      totalFollowers,
      averageEngagementRate: avgEngagementRate,
      leadScoreBreakdown,
      topCategory,
      categoryBreakdown: categoryCounts,
      topLeadCandidates,
    });
  } catch (error) {
    console.error('getPortfolioStats error:', error);
    return res.status(500).json({ error: 'Unable to compute portfolio stats at this time' });
  }
};

module.exports = { getProfileAnalysis, compareProfiles, getPortfolioStats };