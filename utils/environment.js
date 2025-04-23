/**
 * Environment configuration for tests
 */
require('dotenv').config();

// Environment configurations
const environments = {
  local: {
    frontendUrl: 'http://localhost:3000',
    backendUrl: 'http://localhost:4000',
    apiBasePath: '',  // API is directly on port 4000
  },
  demo: {
    frontendUrl: 'https://demo-medara.com',
    backendUrl: 'https://demo-medara.com',
    apiBasePath: 'api',  // API is at /api path
  }
};

// Get current environment from environment variable, default to local
const getCurrentEnvironment = () => {
  const environment = process.env.TEST_ENV || 'local';
  return environments[environment] || environments.local;
};

// Get the current environment config
const env = getCurrentEnvironment();

// Helper to construct full API URLs
const apiUrl = (path) => {
  // Remove leading slash if present as we'll add it in the concatenation
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  if (env.apiBasePath) {
    return `${env.backendUrl}/${env.apiBasePath}/${cleanPath}`;
  } else {
    return `${env.backendUrl}/${cleanPath}`;
  }
};

module.exports = {
  env,
  apiUrl,
  getCurrentEnvironment
};