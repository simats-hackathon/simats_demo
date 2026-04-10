const API_TOKEN = process.env.APIFY_TOKEN;
const ACTOR_ID = process.env.APIFY_ACTOR_ID || 'apify/instagram-profile-scraper';

const buildEndpoint = (actorId) => {
  return `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items`;
};

const fetchRequest = async (...args) => {
  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch(...args);
  }
  const { default: fetch } = await import('node-fetch');
  return fetch(...args);
};

const createError = (status, message, details) => {
  const error = new Error(message);
  error.status = status;
  if (details !== undefined) error.details = details;
  return error;
};

const normalizeInstagramUrl = (url) => {
  if (typeof url !== 'string' || !url.trim()) {
    throw createError(400, 'Instagram profile URL is required');
  }
  let parsed;
  try {
    parsed = new URL(url.trim());
  } catch {
    throw createError(400, 'Invalid Instagram URL');
  }
  const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();
  if (hostname !== 'instagram.com') {
    throw createError(400, 'URL must be an instagram.com link');
  }
  return parsed.toString();
};

const normalizePost = (item) => ({
  ...item,
  caption: item?.caption ?? item?.text ?? '',
  likesCount: Number(item?.likesCount ?? item?.likes ?? 0) || 0,
  commentsCount: Number(item?.commentsCount ?? item?.comments ?? 0) || 0,
  timestamp: item?.timestamp ?? item?.takenAtTimestamp ?? item?.createdAt ?? null,
  type: item?.type ?? item?.mediaType ?? 'unknown',
  hashtags: item?.hashtags ?? [],
});

const runApify = async (url, options = {}) => {
  if (!API_TOKEN) {
    throw createError(500, 'APIFY_TOKEN is missing from environment');
  }

  const normalizedUrl = normalizeInstagramUrl(url);
  const resultsLimit = Number.isFinite(Number(options.resultsLimit))
    ? Math.max(1, Math.min(Number(options.resultsLimit), 100))
    : 30;

  const username = url.replace(/\/$/, '').split('/').pop();
  const requestBody = JSON.stringify({
    usernames: [username],  // ← username not URL!
    resultsLimit,
});

  let response;
  try {
    response = await fetchRequest(
      `${buildEndpoint(ACTOR_ID)}?token=${encodeURIComponent(API_TOKEN)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      }
    );
  } catch (networkError) {
    throw createError(503, 'Network error reaching Apify', networkError.message);
  }

  const rawBody = await response.text();
  let payload;
  try {
    payload = rawBody ? JSON.parse(rawBody) : [];
  } catch {
    throw createError(502, 'Apify returned invalid JSON', rawBody.slice(0, 500));
  }

  if (!response.ok) {
    const message = payload?.error?.message || payload?.error || 'Apify request failed';
    throw createError(response.status, message, payload);
  }

  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
    ? payload.items
    : [];

  if (items.length === 0) {
    console.warn(`[Apify] No data returned for: ${normalizedUrl}`);
  }

  return items.map(normalizePost);
};

module.exports = { runApify };