const API_TOKEN = process.env.APIFY_TOKEN;
const DEFAULT_ACTOR_ID = process.env.APIFY_ACTOR_ID || 'apify/instagram-scraper';
const ACTOR_ID_CANDIDATES = Array.from(
  new Set([
    DEFAULT_ACTOR_ID,
    DEFAULT_ACTOR_ID.replace('~', '/'),
    DEFAULT_ACTOR_ID.replace('/', '~'),
    'apify/instagram-scraper',
    'apify~instagram-scraper',
  ])
);

const buildApifyEndpoint = (actorId) => {
  const encodedActorId = encodeURIComponent(actorId);
  return `https://api.apify.com/v2/acts/${encodedActorId}/run-sync-get-dataset-items`;
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
  if (details !== undefined) {
    error.details = details;
  }
  return error;
};

const normalizeInstagramUrl = (url) => {
  if (typeof url !== 'string' || !url.trim()) {
    throw createError(400, 'Instagram profile URL is required');
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url.trim());
  } catch {
    throw createError(400, 'Invalid Instagram URL');
  }

  const hostname = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();
  if (hostname !== 'instagram.com') {
    throw createError(400, 'Invalid Instagram URL');
  }

  return parsedUrl.toString();
};

const normalizePost = (item) => ({
  ...item,
  caption: item?.caption ?? item?.text ?? '',
  likesCount: Number(item?.likesCount ?? item?.likes ?? 0) || 0,
  commentsCount: Number(item?.commentsCount ?? item?.comments ?? 0) || 0,
  timestamp:
    item?.timestamp ??
    item?.takenAtTimestamp ??
    item?.takenAt ??
    item?.createdAt ??
    null,
});

const runApify = async (url, options = {}) => {
  console.log('🔥 [Apify] Starting Instagram scrape request');
  console.log('🌐 [Apify] Input URL:', url || null);
  console.log('🌐 [Apify] APIFY_TOKEN present:', Boolean(API_TOKEN));

  if (!API_TOKEN) {
    throw createError(500, 'APIFY_TOKEN is missing from the environment');
  }

  const normalizedUrl = normalizeInstagramUrl(url);
  const resultsLimit = Number.isFinite(Number(options.resultsLimit))
    ? Math.max(1, Math.min(Number(options.resultsLimit), 100))
    : 50;

  const requestBody = JSON.stringify({
    directUrls: [normalizedUrl],
    resultsType: 'details',
    resultsLimit,
  });

  let lastError = null;

  for (const actorId of ACTOR_ID_CANDIDATES) {
    const endpoint = buildApifyEndpoint(actorId);
    console.log('🌐 [Apify] Calling actor endpoint:', { actorId, resultsLimit });
    const response = await fetchRequest(`${endpoint}?token=${encodeURIComponent(API_TOKEN)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    const rawBody = await response.text();
    console.log('📦 [Apify] Raw response preview:', {
      actorId,
      status: response.status,
      ok: response.ok,
      bodyPreview: rawBody.slice(0, 500),
    });

    let payload;

    try {
      payload = rawBody ? JSON.parse(rawBody) : [];
    } catch {
      console.error('❌ [Apify] Failed to parse response JSON');
      throw createError(502, 'Apify returned an invalid response', rawBody.slice(0, 500));
    }

    if (!response.ok) {
      const message = payload?.error?.message || payload?.error || rawBody || 'Apify request failed';
      const currentError = createError(response.status, message, payload);
      console.error('❌ [Apify] API request failed:', {
        actorId,
        status: response.status,
        message,
      });

      if (response.status === 404) {
        lastError = currentError;
        continue;
      }

      throw currentError;
    }

    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];

    console.log('📦 [Apify] Normalized items count:', items.length);

    return items.map(normalizePost);
  }

  console.error('❌ [Apify] All actor candidates failed', {
    lastError: lastError?.message || null,
    status: lastError?.status || null,
  });
  throw lastError || createError(404, 'Apify actor endpoint not found');
};

module.exports = { runApify };