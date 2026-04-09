const MS_PER_DAY = 1000 * 60 * 60 * 24;

const safeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getTimestamp = (post) => post?.timestamp ?? post?.takenAtTimestamp ?? post?.takenAt ?? null;

const extractHashtags = (caption) => {
  if (typeof caption !== 'string' || !caption.trim()) {
    return [];
  }

  return caption.match(/#\w+/g) || [];
};

const analyzeData = (posts = [], followers = 0) => {
  const safePosts = Array.isArray(posts) ? posts : [];
  const postCount = safePosts.length;

  if (postCount === 0) {
    return {
      avgLikes: 0,
      avgComments: 0,
      hashtags: [],
      postingFrequency: 0,
      engagementRate: 0,
      totalLikes: 0,
      totalComments: 0,
    };
  }

  let totalLikes = 0;
  let totalComments = 0;
  const hashtags = [];
  const timestamps = [];

  safePosts.forEach((post) => {
    totalLikes += safeNumber(post?.likesCount ?? post?.likes);
    totalComments += safeNumber(post?.commentsCount ?? post?.comments);
    hashtags.push(...extractHashtags(post?.caption));

    const timestamp = getTimestamp(post);
    const parsedTimestamp = timestamp ? new Date(timestamp) : null;
    if (parsedTimestamp && !Number.isNaN(parsedTimestamp.getTime())) {
      timestamps.push(parsedTimestamp.getTime());
    }
  });

  const avgLikes = totalLikes / postCount;
  const avgComments = totalComments / postCount;

  let postingFrequency = 0;
  if (timestamps.length > 1) {
    const newest = Math.max(...timestamps);
    const oldest = Math.min(...timestamps);
    const spanDays = Math.max((newest - oldest) / MS_PER_DAY, 1);
    postingFrequency = postCount / spanDays;
  } else if (timestamps.length === 1) {
    postingFrequency = 1;
  }

  const safeFollowers = safeNumber(followers);
  const engagementRate = safeFollowers > 0 ? ((avgLikes + avgComments) / safeFollowers) * 100 : 0;

  return {
    avgLikes: Number(avgLikes.toFixed(2)),
    avgComments: Number(avgComments.toFixed(2)),
    hashtags: Array.from(new Set(hashtags)),
    postingFrequency: Number(postingFrequency.toFixed(2)),
    engagementRate: Number(engagementRate.toFixed(2)),
    totalLikes,
    totalComments,
  };
};

module.exports = { analyzeData };