require('dotenv').config();

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

const AI_KEYS = [
  'businessCategory',
  'businessType',
  'audienceType',
  'tags',
  'description',
  'keyInsights',
  'strengths',
  'weaknesses',
  'growthPotential',
  'recommendedAction',
  'competitorInsights',
  'contentStrategy',
  'hashtagRecommendations',
  'audienceBehavior',
  'whyThisWorks',
];

const FALLBACK_ANALYSIS = {
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
};

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
  return `You are a business intelligence AI for Instagram lead analysis.

Return STRICT JSON only. No markdown. No explanations. No extra keys.

Task:
Analyze this profile with strong context awareness and produce one "aiAnalysis" object.

Primary signals:
- username
- bio

Secondary signals:
- hashtags

Classification constraints:
- businessCategory must be exactly one of: Fitness, Fashion, Food, Travel, Technology, Beauty, Finance, Art, General
- Do not randomly guess. Use General only when signals are truly unclear.
- Well-known mapping examples: Nike/Adidas => Fitness, NatGeo => Travel.
- businessType must be B2B or B2C.

Interest level rule from engagementRate:
- > 5 => High
- 2 to 5 => Medium
- < 2 => Low
Use this rule to set growthPotential as High/Medium/Low.

Quality constraints:
- contentStrategy must be specific to predicted category and include what to post, frequency, and best posting time.
- hashtagRecommendations must be niche-relevant and avoid generic tags like #growth or #brand.
- recommendedAction must be specific, realistic, and directly actionable.
- Keep all text concise and business-oriented.
- Arrays must contain 2 to 4 items.

Input:
${JSON.stringify({
  username: profile.username,
  followers: profile.followers,
  engagementRate: profile.engagementRate,
  bio: escapeJsonString(profile.bio),
  tags,
}, null, 2)}

Required output format:
{
  "aiAnalysis": {
    "businessCategory": "",
    "businessType": "",
    "audienceType": "",
    "tags": [],
    "description": "",
    "keyInsights": [],
    "strengths": [],
    "weaknesses": [],
    "growthPotential": "",
    "recommendedAction": "",
    "competitorInsights": "",
    "contentStrategy": "",
    "hashtagRecommendations": [],
    "audienceBehavior": "",
    "whyThisWorks": []
  }
}

Fallback rule:
If analysis is impossible from input, return exactly this JSON:
{
  "aiAnalysis": {
    "businessCategory": "Unknown",
    "businessType": "Unknown",
    "audienceType": "Unknown",
    "tags": [],
    "description": "AI unavailable",
    "keyInsights": ["AI unavailable"],
    "strengths": ["AI unavailable"],
    "weaknesses": ["AI unavailable"],
    "growthPotential": "Unknown",
    "recommendedAction": "Retry analysis",
    "competitorInsights": "Unavailable",
    "contentStrategy": "Unavailable",
    "hashtagRecommendations": [],
    "audienceBehavior": "Unavailable",
    "whyThisWorks": ["Unavailable"]
  }
}`;
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

const clampArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 4);
};

const normalizeAiAnalysis = (obj) => {
  const source = obj && typeof obj === 'object' ? obj : {};
  return {
    businessCategory: String(source.businessCategory || 'Unknown'),
    businessType: String(source.businessType || 'Unknown'),
    audienceType: String(source.audienceType || 'Unknown'),
    tags: clampArray(source.tags),
    description: String(source.description || 'AI unavailable'),
    keyInsights: clampArray(source.keyInsights),
    strengths: clampArray(source.strengths),
    weaknesses: clampArray(source.weaknesses),
    growthPotential: String(source.growthPotential || 'Unknown'),
    recommendedAction: String(source.recommendedAction || 'Retry analysis'),
    competitorInsights: String(source.competitorInsights || 'Unavailable'),
    contentStrategy: String(source.contentStrategy || 'Unavailable'),
    hashtagRecommendations: clampArray(source.hashtagRecommendations),
    audienceBehavior: String(source.audienceBehavior || 'Unavailable'),
    whyThisWorks: clampArray(source.whyThisWorks),
  };
};

const resolveAiAnalysis = (parsed) => {
  if (!parsed || typeof parsed !== 'object') return null;
  const candidate = parsed.aiAnalysis && typeof parsed.aiAnalysis === 'object' ? parsed.aiAnalysis : parsed;
  const hasAll = AI_KEYS.every((key) => Object.prototype.hasOwnProperty.call(candidate, key));
  if (!hasAll) return null;
  return normalizeAiAnalysis(candidate);
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
  const safeDefault = { ...FALLBACK_ANALYSIS };

  try {
    console.log(`[Ollama] Starting analysis for profile: ${profile.username}`);
    const prompt = buildPrompt(profile);
    console.log('🧠 PROMPT SENT TO AI:\n', prompt);
    console.log(`[Ollama] Sending request to ${OLLAMA_MODEL} via ${OLLAMA_API_URL}`);
    const rawText = await callOllama(prompt);
    console.log('🤖 RAW AI RESPONSE:\n', rawText);
    
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

    const resolved = resolveAiAnalysis(parsed);

    if (!resolved) {
      const keys = parsed && typeof parsed === 'object' ? Object.keys(parsed) : [];
      console.warn('[Ollama] Response missing required BI fields. Got:', keys);
      return safeDefault;
    }

    console.log('✅ FINAL AI OUTPUT:\n', resolved);

    console.log('[Ollama] Analysis complete for', profile.username);
    return resolved;
  } catch (error) {
    console.error('[Ollama] Error:', error);
    return safeDefault;
  }
};

module.exports = { getAIInsights };