// Client for the Currents news API (https://currentsapi.services).
// Newsful fetches each political "lane" separately so every lane always has
// enough stories, then tags articles with the lane they came from.

const API_KEY =
  import.meta.env.VITE_CURRENTS_API_KEY ||
  'U-KpTJ3lU2QW7BjPvER-ArREpL9Le5wHQ-KdFLco52cBbJe7';

const BASE_URL = 'https://api.currentsapi.services/v1';

export const LANES = [
  {
    id: 'liberal',
    label: 'Liberal',
    requestDomains: 'msnbc.com,huffpost.com',
    matchDomains: ['msnbc.com', 'huffpost.com', 'cnn.com'],
  },
  {
    id: 'conservative',
    label: 'Conservative',
    requestDomains: 'foxnews.com,breitbart.com',
    matchDomains: ['foxnews.com', 'breitbart.com', 'nationalreview.com'],
  },
  {
    id: 'neutral',
    label: 'Neutral',
    requestDomains: 'bbc.com,npr.org',
    matchDomains: ['bbc.com', 'npr.org', 'reuters.com'],
  },
];

export function laneForUrl(url = '') {
  const lane = LANES.find(({ matchDomains }) =>
    matchDomains.some((domain) => url.includes(domain))
  );
  return lane ? lane.id : 'neutral';
}

export function sourceForUrl(url = '') {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function normalizeArticle(article, laneId) {
  return {
    title: article.title,
    url: article.url,
    // Currents sometimes returns the literal string "None" for missing images
    image:
      article.image && article.image !== 'None' && article.image !== 'null'
        ? article.image
        : null,
    published: article.published || null,
    lane: laneId,
  };
}

async function fetchLane(lane, query, signal) {
  const url = query
    ? `${BASE_URL}/search?apiKey=${API_KEY}&domain=${lane.requestDomains}&keywords=${encodeURIComponent(query)}`
    : `${BASE_URL}/latest-news?apiKey=${API_KEY}&domain=${lane.requestDomains}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`News request failed (${response.status})`);
  }
  const data = await response.json();

  const seen = new Set();
  return (data.news || [])
    .filter((article) => {
      if (!article.title || !article.url || seen.has(article.url)) return false;
      seen.add(article.url);
      return true;
    })
    .map((article) => normalizeArticle(article, lane.id));
}

// Returns { liberal: [...], conservative: [...], neutral: [...] }.
// Omit `query` for today's top headlines.
export async function fetchNews(query, signal) {
  const results = await Promise.all(
    LANES.map((lane) => fetchLane(lane, query, signal))
  );
  return Object.fromEntries(LANES.map((lane, i) => [lane.id, results[i]]));
}
