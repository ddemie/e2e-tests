/**
 * Utility functions to help with E2E testing
 */
const { expect } = require('@playwright/test');
const { apiUrl } = require('./environment');

/**
 * Intercepts API calls to bypass email verification
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function mockEmailVerification(page) {
  await page.route('**/auth/verify-email', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    });
  });
}

/**
 * Creates a test user account through the API
 * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context
 * @param {Object} userData - User data for creating account
 * @returns {Promise<Object>} - The created user data
 */
async function createTestUser(request, userData) {
  const response = await request.post(apiUrl('auth/register'), {
    data: userData
  });
  
  expect(response.ok()).toBeTruthy();
  return await response.json();
}

/**
 * Cleans up test users after tests
 * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context
 * @param {string} email - Email of the test user to clean up
 */
async function cleanupTestUser(request, email) {
  try {
    // This endpoint would need to be implemented in your backend specifically for testing
    await request.delete(apiUrl(`test/users/${email}`));
  } catch (error) {
    console.error(`Failed to clean up test user ${email}:`, error);
  }
}

/**
 * Handles authentication for tests
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} credentials - Login credentials
 */
async function loginUser(page, credentials) {
  await page.goto('/auth/signin');
  await page.getByLabel(/email/i).fill(credentials.email);
  await page.getByLabel(/password/i).fill(credentials.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Wait for navigation to complete
  await page.waitForURL(/portal|dashboard/);
}

module.exports = {
  mockEmailVerification,
  createTestUser,
  cleanupTestUser,
  loginUser
};