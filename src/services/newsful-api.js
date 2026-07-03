// Client for the Newsful API (accounts + cross-device saved articles).
import config from '../config';

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${config.API_ENDPOINT}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof body.error === 'string'
        ? body.error
        : body.error?.message || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return body;
}

const NewsfulApi = {
  // Both endpoints resolve to { authToken, user: { id, email } }.
  async login({ email, password }) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return {
      authToken: res.authToken,
      user: res.user ?? { id: res.userId, email },
    };
  },

  async register({ email, password }) {
    const res = await request('/users', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // Modern API logs you in on registration; fall back to an explicit
    // login for older deployments that only return the created user.
    if (res.authToken) {
      return { authToken: res.authToken, user: res.user };
    }
    return NewsfulApi.login({ email, password });
  },

  getSavedArticles(token) {
    return request('/saved-articles', { token });
  },

  saveArticle(token, { title, url, image, source }) {
    return request('/saved-articles', {
      method: 'POST',
      token,
      body: JSON.stringify({ title, url, image, source }),
    });
  },

  deleteSavedArticle(token, id) {
    return request(`/saved-articles/${id}`, { method: 'DELETE', token });
  },
};

export default NewsfulApi;
