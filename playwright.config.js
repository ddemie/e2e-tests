// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Read environment from .env file or environment variables
const environment = process.env.TEST_ENV || 'local';

// Environment configurations
const environments = {
  local: {
    frontendUrl: 'http://localhost:3000',
    backendUrl: 'http://localhost:4000',
    apiBasePath: '',  // API is directly on port 4000
    healthCheckPath: '/api/health'
  },
  demo: {
    frontendUrl: 'https://demo-medara.com',
    backendUrl: 'https://demo-medara.com',
    apiBasePath: '/api',  // API is at /api path
    healthCheckPath: '/api/health'
  }
};

const env = environments[environment];

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Base URL for the frontend application
    baseURL: env.frontendUrl,
    // Capture screenshot on test failure
    screenshot: 'only-on-failure',
    // Record video on failure
    video: 'on-first-retry',
    // Capture trace on failure
    trace: 'on-first-retry',
    // Pass environment variables to the tests
    extraHTTPHeaders: {
      'x-environment': environment,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Start both frontend and backend servers for testing (only in local environment)
  ...(environment === 'local' ? {
    webServer: [
      {
        command: 'cd ../frontend && npm run dev',
        url: env.frontendUrl,
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
      },
      {
        command: 'cd ../backend && npm run start',
        url: `${env.backendUrl}${env.healthCheckPath}`,
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    ],
  } : {}),
});