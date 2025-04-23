# Medara E2E Tests

This project contains end-to-end tests for the Medara application using Playwright. The purpose is to automate testing for account creation, automation and any other e2e testing needed for application. Must have in same folder as front and backend of medara project folder in order to run properly.

## Features

- Tests for signup flow (direct and OAuth)
- Tests for onboarding flow
- Page Object Models for maintainable tests
- Test fixtures for reusable test data
- Utility functions for common testing tasks

## Prerequisites

- Node.js 16 or higher
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests against local environment (default)
npm test

# Run tests against demo environment
TEST_ENV=demo npm test

# Run tests with UI mode
npm run test:ui

# Run tests with browser visible
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Show the HTML report
npm run report
```

## Project Structure

- `/tests`: Test files for different application flows
- `/fixtures`: Reusable test data and page object models
- `/utils`: Utility functions for testing

## Environment Configuration

The tests can run against multiple environments by setting the `TEST_ENV` environment variable:

### Local Environment (default)
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Run with: `npm test` or `TEST_ENV=local npm test`

### Demo Environment
- Frontend: https://demo-medara.com
- Backend: https://demo-medara.com/api
- Run with: `TEST_ENV=demo npm test`

To add additional environments, modify the `environments` object in:
- `playwright.config.js`
- `utils/environment.js`

You can create a `.env` file based on the `.env.example` to set default environment variables.

## CI/CD Integration

For continuous integration, the tests can be run in a CI environment by setting the `CI` environment variable:

```bash
CI=true TEST_ENV=demo npm test
```

## Test Development Guidelines

1. Use page object models for all UI interactions
2. Keep tests focused on a single user flow or feature
3. Mock API responses when possible to speed up tests
4. Use the utility functions for common tasks
5. Keep test data in the fixtures directory