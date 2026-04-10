const fetchRequest = async (...args) => {
  if (typeof globalThis.fetch === 'function') return globalThis.fetch(...args);
  const { default: fetch } = await import('node-fetch');
  return fetch(...args);
};

const generateAIInsights = async (profileInfo, analysisResult, posts) => {
  const apiKey = process.env.OPENAI_API_KEY;

  // If no API key — return smart rule-based insights
  if (!apiKey) {
    console.warn('[AI] No API key found — using rule-based insights');
    return generateRuleBasedInsights(profileInfo, analysisResult);
  }

  const prompt = `
You are an expert Instagram marketing analyst. Analyze this Instagram business profile data and provide actionable insights.

Profile Info:
- Username: ${profileInfo.username || 'unknown'}
- Followers: ${profileInfo.followersCount || 0}
- Bio: ${profileInfo.biography || 'N/A'}
- Business Category: ${profileInfo.businessCategoryName || 'N/A'}
- Is Business Account: ${profileInfo.isBusinessAccount || false}

Analysis Results:
- Total Posts Analyzed: ${analysisResult.totalPosts}
- Average Likes: ${analysisResult.avgLikes}
- Average Comments: ${analysisResult.avgComments}
- Engagement Rate: ${analysisResult.engagementRate}%
- Best Posting Day: ${analysisResult.bestPostingDay}
- Best Posting Hour: ${analysisResult.bestPostingHour}
- Interest Level: ${analysisResult.interestLevel}
- Top Hashtags: ${analysisResult.topHashtags.slice(0, 5).map(h => h.tag).join(', ')}
- Content Mix: ${JSON.stringify(analysisResult.contentTypeMix)}

Provide a JSON response with these exact fields:
{
  "competitorStrengths": ["strength1", "strength2", "strength3"],
  "competitorWeaknesses": ["weakness1", "weakness2"],
  "contentStrategy": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "hashtagRecommendations": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "thirtyDayPlan": "Write a 3-sentence 30-day content plan",
  "audienceInsight": "One sentence about their audience",
  "overallScore": 75
}
Return only valid JSON, no extra text.
`;

  try {
    const response = await fetchRequest('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      const cleaned = content.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      console.warn('[AI] Could not parse JSON response — using rule-based');
      return generateRuleBasedInsights(profileInfo, analysisResult);
    }
  } catch (err) {
    console.error('[AI] API call failed:', err.message);
    return generateRuleBasedInsights(profileInfo, analysisResult);
  }
};

const generateRuleBasedInsights = (profileInfo, analysis) => {
  const engagement = analysis.engagementRate;
  const topTags = analysis.topHashtags.slice(0, 5).map((h) => `#${h.tag}`);

  return {
    competitorStrengths: [
      engagement > 3 ? 'Strong audience engagement' : 'Active posting schedule',
      analysis.totalPosts > 20 ? 'Consistent content volume' : 'Focused content approach',
      topTags.length > 0 ? 'Uses hashtag strategy' : 'Organic growth focus',
    ],
    competitorWeaknesses: [
      engagement < 2 ? 'Low engagement rate needs improvement' : 'Could diversify content types',
      'Limited cross-platform promotion detected',
    ],
    contentStrategy: [
      `Post on ${analysis.bestPostingDay} at ${analysis.bestPostingHour} for best reach`,
      'Use a mix of Reels, carousels, and single images',
      'Add strong CTA in every caption',
      'Engage with comments within first hour of posting',
      'Collaborate with micro-influencers in your niche',
    ],
    hashtagRecommendations: topTags.length > 0
      ? topTags
      : ['#business', '#marketing', '#instagram', '#growth', '#india'],
    thirtyDayPlan: `Week 1-2: Post 3x per week focusing on ${analysis.bestPostingDay}s. Week 3: Launch a giveaway or interactive story poll. Week 4: Analyze results and double down on top performing content type.`,
    audienceInsight: `Audience is most active on ${analysis.bestPostingDay}s around ${analysis.bestPostingHour} — schedule posts accordingly.`,
    overallScore: Math.min(
      100,
      Math.round(30 + engagement * 10 + (analysis.totalPosts > 10 ? 20 : 0))
    ),
  };
};

module.exports = { generateAIInsights };