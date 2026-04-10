const analyzeProfile = (posts, profileInfo = {}) => {
  if (!posts || posts.length === 0) {
    return {
      totalPosts: 0,
      avgLikes: 0,
      avgComments: 0,
      engagementRate: 0,
      bestPostingDay: 'N/A',
      bestPostingHour: 'N/A',
      topHashtags: [],
      contentTypeMix: {},
      topPosts: [],
      interestLevel: 'Low',
    };
  }

  // Basic metrics
  const totalPosts = posts.length;
  const avgLikes = Math.round(
    posts.reduce((sum, p) => sum + p.likesCount, 0) / totalPosts
  );
  const avgComments = Math.round(
    posts.reduce((sum, p) => sum + p.commentsCount, 0) / totalPosts
  );

  const followers = profileInfo.followersCount || 1;
  const engagementRate = parseFloat(
    (((avgLikes + avgComments) / followers) * 100).toFixed(2)
  );

  // Best posting day
  const dayCounts = {};
  const hourCounts = {};
  posts.forEach((post) => {
    if (post.timestamp) {
      const date = new Date(post.timestamp);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hour = date.getHours();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });

  const bestPostingDay =
    Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  const bestHour =
    Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const bestPostingHour = bestHour !== undefined ? `${bestHour}:00` : 'N/A';

  // Top hashtags
  const hashtagCounts = {};
  posts.forEach((post) => {
    (post.hashtags || []).forEach((tag) => {
      const clean = tag.replace('#', '').toLowerCase();
      hashtagCounts[clean] = (hashtagCounts[clean] || 0) + 1;
    });
  });
  const topHashtags = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // Content type mix
  const contentTypeMix = {};
  posts.forEach((post) => {
    const type = post.type || 'unknown';
    contentTypeMix[type] = (contentTypeMix[type] || 0) + 1;
  });

  // Top performing posts
  const topPosts = [...posts]
    .sort((a, b) => (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount))
    .slice(0, 5)
    .map((p) => ({
      caption: p.caption?.slice(0, 100) || '',
      likes: p.likesCount,
      comments: p.commentsCount,
      type: p.type,
      timestamp: p.timestamp,
    }));

  // Interest level scoring
  let interestLevel = 'Low';
  if (engagementRate > 5) interestLevel = 'High';
  else if (engagementRate > 2) interestLevel = 'Medium';

  return {
    totalPosts,
    avgLikes,
    avgComments,
    engagementRate,
    bestPostingDay,
    bestPostingHour,
    topHashtags,
    contentTypeMix,
    topPosts,
    interestLevel,
  };
};

const classifyBusiness = (profileInfo, analysisResult) => {
  const bio = (profileInfo?.biography || '').toLowerCase();
  const category = (profileInfo?.businessCategoryName || '').toLowerCase();

  const b2bKeywords = ['agency', 'wholesale', 'b2b', 'enterprise', 'solutions',
    'consulting', 'services', 'software', 'saas', 'marketing agency'];
  const b2cKeywords = ['shop', 'store', 'fashion', 'food', 'beauty', 'lifestyle',
    'retail', 'buy now', 'order', 'delivery', 'jewellery', 'clothing'];

  let b2bScore = 0;
  let b2cScore = 0;

  b2bKeywords.forEach((kw) => { if (bio.includes(kw) || category.includes(kw)) b2bScore++; });
  b2cKeywords.forEach((kw) => { if (bio.includes(kw) || category.includes(kw)) b2cScore++; });

  const businessCategory = b2bScore > b2cScore ? 'B2B' : 'B2C';

  return {
    leadSource: 'Web Form',
    businessCategory,
    interestLevel: analysisResult.interestLevel,
    recommendedAction: getRecommendedAction(analysisResult),
  };
};

const getRecommendedAction = (analysis) => {
  if (analysis.engagementRate > 5) {
    return 'High engagement — scale content production and explore paid promotions';
  } else if (analysis.engagementRate > 2) {
    return 'Medium engagement — improve posting consistency and hashtag strategy';
  } else {
    return 'Low engagement — build MVP content strategy and post 3x per week';
  }
};

module.exports = { analyzeProfile, classifyBusiness };