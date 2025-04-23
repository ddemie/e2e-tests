const { test, expect } = require('@playwright/test');
const { SignupPage, OnboardingPage } = require('../fixtures/page-objects');
const { testUsers } = require('../fixtures/test-users');
const { mockEmailVerification } = require('../utils/test-helpers');

test.describe('Onboarding Flow', () => {
  test('should complete the onboarding process after signup', async ({ page }) => {
    // First complete signup
    await mockEmailVerification(page);
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.completeDirectSignup(testUsers.employer);
    
    // Verify we're at the onboarding page
    await expect(page).toHaveURL(/onboarding/);
    
    // Complete onboarding
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.completeOnboarding();
    
    // Verify redirect to dashboard after onboarding completion
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should be able to resume onboarding process', async ({ page, context }) => {
    // First complete signup
    await mockEmailVerification(page);
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.completeDirectSignup(testUsers.freelancer);
    
    // Start onboarding
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.startOnboarding();
    
    // Complete first step only
    await onboardingPage.selectSingleOption();
    await onboardingPage.clickNext();
    
    // Store cookies/localStorage for auth state
    const authState = await context.storageState();
    
    // Create a new page with the same auth state
    const newPage = await context.newPage();
    
    // Go directly to onboarding
    await newPage.goto('/portal/onboarding');
    
    // Verify we can resume
    const resumeButton = newPage.getByRole('button', { name: /resume/i });
    await expect(resumeButton).toBeVisible();
    
    // Click resume and continue with the process
    const newOnboardingPage = new OnboardingPage(newPage);
    await newOnboardingPage.startOnboarding();
    
    // We should be on the second step now
    // Verify we're not on the first step by looking for a specific element from step 2
    const stepIndicator = newPage.getByText(/step 2/i);
    await expect(stepIndicator).toBeVisible();
  });

  test('should validate required fields during onboarding', async ({ page }) => {
    // First complete signup
    await mockEmailVerification(page);
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.completeDirectSignup(testUsers.employer);
    
    // Start onboarding
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.startOnboarding();
    
    // Try to proceed without selecting any option
    await onboardingPage.clickNext();
    
    // Check for validation error
    const errorMessage = page.getByText(/this field is required|please select an option/i);
    await expect(errorMessage).toBeVisible();
  });

  test('should display different onboarding steps based on account type', async ({ page }) => {
    // Complete signup as an employer
    await mockEmailVerification(page);
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    
    // Sign up as an employer
    await signupPage.selectAccountType('employer');
    await signupPage.clickNext();
    await signupPage.selectPrimaryRole('businessowner');
    await signupPage.clickNext();
    await signupPage.selectIndustries(['Healthcare']);
    await signupPage.clickNext();
    await signupPage.fillBasicInfo('Test', 'Employer', testUsers.employer.email);
    await signupPage.clickNext();
    await signupPage.enterVerificationCode('123456');
    await signupPage.clickVerify();
    await signupPage.setPassword(testUsers.employer.password, testUsers.employer.confirmPassword);
    await signupPage.clickCompleteSignup();
    
    // Verify we're at the onboarding page
    await expect(page).toHaveURL(/onboarding/);
    
    // Start onboarding
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.startOnboarding();
    
    // Check for employer-specific onboarding content
    const employerSpecificText = page.getByText(/company|budget|hiring/i);
    await expect(employerSpecificText).toBeVisible();
    
    // Now sign up as a freelancer in a new page
    const context = page.context();
    const newPage = await context.newPage();
    await mockEmailVerification(newPage);
    
    const freelancerSignupPage = new SignupPage(newPage);
    await freelancerSignupPage.goto();
    
    // Sign up as a freelancer
    await freelancerSignupPage.selectAccountType('freelancer');
    await freelancerSignupPage.clickNext();
    await freelancerSignupPage.selectPrimaryRole('developer');
    await freelancerSignupPage.clickNext();
    await freelancerSignupPage.selectIndustries(['Technology']);
    await freelancerSignupPage.clickNext();
    await freelancerSignupPage.fillBasicInfo('Test', 'Freelancer', testUsers.freelancer.email);
    await freelancerSignupPage.clickNext();
    await freelancerSignupPage.enterVerificationCode('123456');
    await freelancerSignupPage.clickVerify();
    await freelancerSignupPage.setPassword(testUsers.freelancer.password, testUsers.freelancer.confirmPassword);
    await freelancerSignupPage.clickCompleteSignup();
    
    // Verify we're at the onboarding page
    await expect(newPage).toHaveURL(/onboarding/);
    
    // Start onboarding
    const freelancerOnboardingPage = new OnboardingPage(newPage);
    await freelancerOnboardingPage.startOnboarding();
    
    // Check for freelancer-specific onboarding content
    const freelancerSpecificText = newPage.getByText(/skills|portfolio|rate/i);
    await expect(freelancerSpecificText).toBeVisible();
  });
});