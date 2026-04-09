const analyzeData = (posts, followers) => {
  let totalLikes = 0;
  let totalComments = 0;
  let hashtags = [];

  posts.forEach(post => {
    totalLikes += post.likesCount || 0;
    totalComments += post.commentsCount || 0;

    // Extract hashtags
    if (post.caption) {
      const tags = post.caption.match(/#\w+/g);
      if (tags) hashtags.push(...tags);
    }
  });

  const avgLikes = totalLikes / posts.length;
  const avgComments = totalComments / posts.length;

  // Posting frequency
  const dates = posts.map(p => new Date(p.timestamp)).sort((a, b) => b - a);
  let frequency = 0;
  if (dates.length > 1) {
    const diffDays = (dates[0] - dates[dates.length - 1]) / (1000 * 60 * 60 * 24);
    frequency = posts.length / diffDays;
  }

  // Engagement rate
  const engagementRate = ((avgLikes + avgComments) / followers) * 100;

  return {
    avgLikes,
    avgComments,
    hashtags,
    postingFrequency: frequency,
    engagementRate
  };
};

module.exports = { analyzeData };