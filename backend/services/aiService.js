const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeProfile = async (profile) => {
  const prompt = `
Analyze this Instagram profile and provide business intelligence insights.

Profile Data:
- Username: ${profile.username}
- Followers: ${profile.followers}
- Average Likes: ${profile.avg_likes}
- Average Comments: ${profile.avg_comments}
- Bio: ${profile.bio}
- Sample Posts: ${profile.posts.map(p => p.caption).join('; ')}

Provide a JSON response with the following structure:
{
  "businessClassification": "e.g., fitness, fashion, tech, food, travel, beauty, art",
  "keyInsights": "Brief summary of what makes this profile valuable",
  "growthPotential": "High/Medium/Low with explanation",
  "recommendedAction": "Specific action a business should take, e.g., 'Partner for sponsored posts', 'Invest in similar content', etc."
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    const content = response.choices[0].message.content.trim();
    return JSON.parse(content);
  } catch (error) {
    console.error('Error with OpenAI:', error);
    return {
      businessClassification: 'Unknown',
      keyInsights: 'Unable to analyze',
      growthPotential: 'Unknown',
      recommendedAction: 'Review manually',
    };
  }
};

module.exports = { analyzeProfile };