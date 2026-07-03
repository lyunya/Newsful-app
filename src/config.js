const config = {
  API_ENDPOINT:
    import.meta.env.VITE_API_ENDPOINT || 'https://newsful-api.onrender.com/api',
  TOKEN_KEY: 'newsful-auth-token',
  USER_KEY: 'newsful-user',
  GUEST_SAVES_KEY: 'newsful-guest-saves',
  THEME_KEY: 'newsful-theme',
};

export default config;
