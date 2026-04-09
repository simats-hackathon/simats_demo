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
  return `You are a profile intelligence engine. Your response MUST be ONLY valid JSON with no additional text, explanation, or markdown.

Return a single JSON object with exactly these 4 keys:
- businessClassification (string): The type of business or profile category
- keyInsights (array of strings): 2-3 key observations about the profile
- growthPotential (string): One of "High", "Medium", or "Low"
- recommendedAction (string): A specific business action to take

Profile data:
${JSON.stringify({
    username: profile.username,
    followers: profile.followers,
    engagement: {
      likes: profile.avg_likes,
      comments: profile.avg_comments,
      rate: profile.engagementRate + '%'
    },
    bio: escapeJsonString(profile.bio),
    tags,
  }, null, 2)}

IMPORTANT: Respond with ONLY the JSON object. No markdown, no explanation, no extra text.`;
};

const cleanJson = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  
  // Remove markdown code blocks
  let cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  
  // Try to extract JSON using regex - find first { and last }
  const match = cleaned.match(/{[\s\S]*}/);
  if (match) {
    return match[0];
  }
  
  return null;
};

const parseJsonSafely = (raw) => {
  try {
    if (!raw || typeof raw !== 'string') {
      console.warn('parseJsonSafely: raw is not a string:', typeof raw);
      return null;
    }
    
    const cleaned = cleanJson(raw);
    if (!cleaned) {
      console.warn('parseJsonSafely: Could not extract JSON from raw text');
      console.warn('Raw text (first 200 chars):', raw.substring(0, 200));
      return null;
    }
    
    const parsed = JSON.parse(cleaned);
    console.log('✓ Successfully parsed JSON:', Object.keys(parsed).sort().join(', '));
    return parsed;
  } catch (error) {
    console.error('parseJsonSafely: JSON parse error:', error.message);
    return null;
  }
};

const getAIInsights = async (profile) => {
  const safeDefault = {
    businessClassification: 'Unknown',
    keyInsights: ['Unable to evaluate the profile at this time.'],
    growthPotential: 'Unknown',
    recommendedAction: 'Review the profile manually and ensure Gemini configuration is valid.',
  };

  if (!apiKey) {
    console.error('[Gemini] GEMINI_API_KEY is not set in environment');
    return safeDefault;
  }

  try {
    console.log(`[Gemini] Starting analysis for profile: ${profile.username}`);
    
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = buildPrompt(profile);
    
    console.log('[Gemini] Sending request to Gemini API...');
    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    console.log('[Gemini] Response received from Gemini API');
    console.log('[Gemini] Response object keys:', Object.keys(response).sort());
    
    // Extract text from response - Gemini API returns text() method on response
    let rawText = '';
    
    if (typeof response.text === 'function') {
      rawText = response.text();
      console.log('[Gemini] Used response.text() method');
    } else if (response.response && typeof response.response.text === 'function') {
      rawText = response.response.text();
      console.log('[Gemini] Used response.response.text() method');
    } else if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        rawText = candidate.content.parts[0].text;
        console.log('[Gemini] Extracted from candidates[0].content.parts[0].text');
      }
    }
    
    if (!rawText || typeof rawText !== 'string') {
      console.error('[Gemini] No text extracted from response. Response structure:', JSON.stringify(response, null, 2).substring(0, 500));
      return safeDefault;
    }
    
    console.log('[Gemini] Raw response text (first 300 chars):', rawText.substring(0, 300));
    
    const parsed = parseJsonSafely(rawText);
    if (!parsed) {
      console.error('[Gemini] Failed to parse JSON from response');
      console.error('[Gemini] Raw response:', rawText);
      return safeDefault;
    }

    // Validate required fields
    const requiredFields = ['businessClassification', 'keyInsights', 'growthPotential', 'recommendedAction'];
    const hasAllFields = requiredFields.every(field => field in parsed);
    
    if (!hasAllFields) {
      console.warn('[Gemini] Response missing required fields. Got:', Object.keys(parsed));
      return safeDefault;
    }

    console.log('[Gemini] ✓ Analysis complete for', profile.username);
    
    return {
      businessClassification: parsed.businessClassification || 'Unknown',
      keyInsights: Array.isArray(parsed.keyInsights)
        ? parsed.keyInsights.slice(0, 5).filter(k => k)
        : [String(parsed.keyInsights || 'No insights available.')],
      growthPotential: ['High', 'Medium', 'Low'].includes(parsed.growthPotential) 
        ? parsed.growthPotential 
        : 'Unknown',
      recommendedAction: String(parsed.recommendedAction || 'Review manually'),
    };
  } catch (error) {
    console.error('[Gemini] Exception during API call:', error.message);
    console.error('[Gemini] Error details:', {
      name: error.name,
      code: error.code,
      status: error.status,
      message: error.message,
    });
    return safeDefault;
  }
};

module.exports = { getAIInsights };