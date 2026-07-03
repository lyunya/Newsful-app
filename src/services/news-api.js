// News comes from the Newsful API, which aggregates free Google News RSS
// feeds per outlet — no metered news-API key to expire.
import config from '../config';

export const LANES = [
  {
    id: 'liberal',
    label: 'Liberal',
    matchDomains: ['msnbc.com', 'huffpost.com', 'cnn.com'],
  },
  {
    id: 'conservative',
    label: 'Conservative',
    matchDomains: ['foxnews.com', 'breitbart.com', 'nationalreview.com'],
  },
  {
    id: 'neutral',
    label: 'Neutral',
    matchDomains: ['bbc.com', 'npr.org', 'reuters.com'],
  },
];

// Lane accent for articles saved before sources were stored.
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

// Returns { liberal: [...], conservative: [...], neutral: [...] }.
// Omit `query` for today's top stories.
export async function fetchNews(query, signal) {
  const url = query
    ? `${config.API_ENDPOINT}/news?q=${encodeURIComponent(query)}`
    : `${config.API_ENDPOINT}/news`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`News request failed (${response.status})`);
  }
  return response.json();
}
