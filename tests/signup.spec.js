const { test, expect } = require('@playwright/test');
const { SignupPage } = require('../fixtures/page-objects');
const { testUsers } = require('../fixtures/test-users');
const { mockEmailVerification } = require('../utils/test-helpers');

test.describe('Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the email verification API call
    await mockEmailVerification(page);
  });

  test('should complete the direct signup process for an employer', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    
    // Complete the signup process
    await signupPage.completeDirectSignup(testUsers.employer);
    
    // Verify redirect to dashboard or onboarding
    await expect(page).toHaveURL(/portal|onboarding/);
  });

  test('should complete the direct signup process for a freelancer', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    
    // Complete the signup process
    await signupPage.completeDirectSignup(testUsers.freelancer);
    
    // Verify redirect to dashboard or onboarding
    await expect(page).toHaveURL(/portal|onboarding/);
  });

  test('should complete OAuth signup flow', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.gotoOAuthSignup();
    
    // Complete the OAuth signup process
    await signupPage.completeOAuthSignup(testUsers.oauthUser);
    
    // Verify redirect to dashboard or onboarding
    await expect(page).toHaveURL(/portal|onboarding/);
  });

  test('should show error for invalid email format', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    
    // Go through the first steps
    await signupPage.selectAccountType('employer');
    await signupPage.clickNext();
    
    await signupPage.selectPrimaryRole('businessowner');
    await signupPage.clickNext();
    
    await signupPage.selectIndustries(['Healthcare']);
    await signupPage.clickNext();
    
    // Enter invalid email
    await signupPage.fillBasicInfo('Test', 'User', 'invalid-email');
    await signupPage.clickNext();
    
    // Check for error message
    const errorMessage = page.getByText(/invalid email/i);
    await expect(errorMessage).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    
    // Go through the first steps
    await signupPage.selectAccountType('employer');
    await signupPage.clickNext();
    
    await signupPage.selectPrimaryRole('businessowner');
    await signupPage.clickNext();
    
    await signupPage.selectIndustries(['Healthcare']);
    await signupPage.clickNext();
    
    await signupPage.fillBasicInfo('Test', 'User', 'test@example.com');
    await signupPage.clickNext();
    
    await signupPage.enterVerificationCode('123456');
    await signupPage.clickVerify();
    
    // Enter mismatched passwords
    await signupPage.setPassword('Password123!', 'DifferentPassword123!');
    await signupPage.clickCompleteSignup();
    
    // Check for error message
    const errorMessage = page.getByText(/passwords do not match/i);
    await expect(errorMessage).toBeVisible();
  });
});