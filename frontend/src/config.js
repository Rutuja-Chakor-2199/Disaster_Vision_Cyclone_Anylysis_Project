// Frontend configuration
const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000',
  OPENWEATHER_API_KEY: process.env.REACT_APP_OPENWEATHER_API_KEY || '',
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
};

export default config;
