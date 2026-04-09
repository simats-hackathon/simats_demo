const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const client = new GoogleGenerativeAI({ apiKey });

const escapeJsonString = (value) =>
  String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildPrompt = (profile) => {
  const tags = Array.isArray(profile.tags) ? profile.tags : [];
  return `You are a profile intelligence engine. Respond with STRICT JSON only, no markdown, no explanation, and no extra text.\n\nReturn a single JSON object with exactly these keys: businessClassification, keyInsights, growthPotential, recommendedAction.\n\nProfile:\n${JSON.stringify({
    username: profile.username,
    followers: profile.followers,
    averageLikes: profile.avg_likes,
    averageComments: profile.avg_comments,
    engagementRate: profile.engagementRate,
    bio: escapeJsonString(profile.bio),
    tags,
  })}\n\nEnsure the output is valid JSON. Use an array for keyInsights. Use High, Medium, or Low for growthPotential.\n`;
};

const cleanJson = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  let cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
};

const parseJsonSafely = (raw) => {
  try {
    const cleaned = cleanJson(raw);
    if (!cleaned) return null;
    return JSON.parse(cleaned);
  } catch (error) {
    return null;
  }
};

const getAIInsights = async (profile) => {
  const prompt = buildPrompt(profile);
  const safeDefault = {
    businessClassification: 'Unknown',
    keyInsights: ['Unable to evaluate the profile at this time.'],
    growthPotential: 'Unknown',
    recommendedAction: 'Review the profile manually and ensure Gemini configuration is valid.',
  };

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set.');
    return safeDefault;
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 400,
      },
    });

    const raw = response?.response?.text() || response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = parseJsonSafely(raw);
    if (!parsed) {
      console.error('Gemini response could not be parsed as JSON:', raw);
      return safeDefault;
    }

    return {
      businessClassification: parsed.businessClassification || 'Unknown',
      keyInsights: Array.isArray(parsed.keyInsights)
        ? parsed.keyInsights
        : [String(parsed.keyInsights || 'No insights available.')],
      growthPotential: String(parsed.growthPotential || 'Unknown'),
      recommendedAction: String(parsed.recommendedAction || 'Review manually'),
    };
  } catch (error) {
    console.error('Gemini AI error:', error);
    return safeDefault;
  }
};

module.exports = { getAIInsights };