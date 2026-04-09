require('dotenv').config();

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

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
  return `You are a profile intelligence engine. Return ONLY valid JSON with no explanation, no markdown, and no extra text.

Return exactly this JSON shape:
{
  "businessClassification": "string",
  "keyInsights": ["string", "string", "string"],
  "growthPotential": "High|Medium|Low",
  "recommendedAction": "string"
}

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

Return ONLY valid JSON.`;
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

const parseJsonSafely = (rawText) => {
  try {
    const cleaned = cleanJson(rawText);
    return cleaned ? JSON.parse(cleaned) : null;
  } catch (error) {
    console.error('[Ollama] JSON parse error:', error.message);
    return null;
  }
};

const callOllama = async (prompt) => {
  const response = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data?.response || '';
};

const getAIInsights = async (profile) => {
  const safeDefault = {
    businessClassification: 'Unknown',
    keyInsights: ['Unable to evaluate the profile at this time.'],
    growthPotential: 'Unknown',
    recommendedAction: 'Review the profile manually and ensure Ollama is running.',
  };

  try {
    console.log(`[Ollama] Starting analysis for profile: ${profile.username}`);
    const prompt = buildPrompt(profile);
    console.log(`[Ollama] Sending request to ${OLLAMA_MODEL} via ${OLLAMA_API_URL}`);
    const rawText = await callOllama(prompt);
    
    if (!rawText || typeof rawText !== 'string') {
      console.error('[Ollama] Empty response from model');
      return safeDefault;
    }

    console.log('[Ollama] Raw output:', rawText.substring(0, 300));
    
    const parsed = parseJsonSafely(rawText);
    if (!parsed) {
      console.error('[Ollama] JSON parsing failed for model output');
      return safeDefault;
    }

    // Validate required fields
    const requiredFields = ['businessClassification', 'keyInsights', 'growthPotential', 'recommendedAction'];
    const hasAllFields = requiredFields.every(field => field in parsed);

    if (!hasAllFields) {
      console.warn('[Ollama] Response missing required fields. Got:', Object.keys(parsed));
      return safeDefault;
    }

    console.log('[Ollama] Analysis complete for', profile.username);

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
    console.error('[Ollama] Error:', error);
    return safeDefault;
  }
};

module.exports = { getAIInsights };