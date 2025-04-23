/**
 * Test user data for various scenarios
 */

/**
 * Generate a random email to avoid conflicts in tests
 * @returns {string} Random email address
 */
function generateTestEmail() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `test-user-${timestamp}-${random}@example.com`;
}

const testUsers = {
  employer: {
    accountType: 'hirer',
    primaryRole: 'Business Owner',
    industries: ['Healthcare'],
    firstName: 'Test',
    lastName: 'Employer',
    email: generateTestEmail(),
    password: 'SecureTest123!',
    confirmPassword: 'SecureTest123!'
  },
  
  freelancer: {
    accountType: 'provider',
    primaryRole: 'Designer',
    industries: ['Technology'],
    firstName: 'Test',
    lastName: 'Freelancer',
    email: generateTestEmail(),
    password: 'SecureTest123!',
    confirmPassword: 'SecureTest123!'
  },
  
  oauthUser: {
    accountType: 'provider',
    primaryRole: 'Developer',
    industries: ['Software'],
    firstName: 'OAuth',
    lastName: 'User',
    email: generateTestEmail()
  }
};

module.exports = {
  testUsers,
  generateTestEmail
};