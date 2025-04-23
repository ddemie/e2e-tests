/**
 * Page Object Models for Medara application
 */
class SignupPage {
  /**
   * @param {import('@playwright/test').Page} page 
   */
  constructor(page) {
    this.page = page;
    this.accountTypeRadios = {
      employer: page.getByLabel(/employer/i),
      freelancer: page.getByLabel(/freelancer/i)
    };
    this.primaryRoleRadios = {
      businessOwner: page.getByLabel(/business owner/i),
      designer: page.getByLabel(/designer/i),
      developer: page.getByLabel(/developer/i)
    };
    this.industryOptions = {
      healthcare: page.getByText(/healthcare/i),
      technology: page.getByText(/technology/i),
      software: page.getByText(/software/i)
    };
    this.firstNameInput = page.getByLabel(/first name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.emailInput = page.getByLabel(/email/i);
    this.verificationCodeInput = page.getByLabel(/verification code/i);
    this.passwordInput = page.getByLabel(/^password/i);
    this.confirmPasswordInput = page.getByLabel(/confirm password/i);
    this.nextButton = page.getByRole('button', { name: /next/i });
    this.verifyButton = page.getByRole('button', { name: /verify/i });
    this.completeSignupButton = page.getByRole('button', { name: /complete signup/i });
  }

  async goto() {
    await this.page.goto('/auth/signUp');
  }

  async gotoOAuthSignup() {
    await this.page.goto('/auth/signUp?oauth=true');
  }

  async selectAccountType(type) {
    await this.accountTypeRadios[type].click();
  }

  async selectPrimaryRole(role) {
    await this.primaryRoleRadios[role].click();
  }

  async selectIndustries(industries) {
    for (const industry of industries) {
      await this.industryOptions[industry.toLowerCase()].click();
    }
  }

  async fillBasicInfo(firstName, lastName, email) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
  }

  async enterVerificationCode(code) {
    await this.verificationCodeInput.fill(code);
  }

  async setPassword(password, confirmPassword) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickVerify() {
    await this.verifyButton.click();
  }

  async clickCompleteSignup() {
    await this.completeSignupButton.click();
  }

  async completeDirectSignup(userData) {
    await this.selectAccountType(userData.accountType);
    await this.clickNext();
    
    await this.selectPrimaryRole(userData.primaryRole.toLowerCase().replace(' ', ''));
    await this.clickNext();
    
    await this.selectIndustries(userData.industries);
    await this.clickNext();
    
    await this.fillBasicInfo(userData.firstName, userData.lastName, userData.email);
    await this.clickNext();
    
    await this.enterVerificationCode('123456');
    await this.clickVerify();
    
    await this.setPassword(userData.password, userData.confirmPassword);
    await this.clickCompleteSignup();
  }

  async completeOAuthSignup(userData) {
    await this.selectAccountType(userData.accountType);
    await this.clickNext();
    
    await this.selectPrimaryRole(userData.primaryRole.toLowerCase().replace(' ', ''));
    await this.clickNext();
    
    await this.selectIndustries(userData.industries);
    await this.clickCompleteSignup();
  }
}

class OnboardingPage {
  /**
   * @param {import('@playwright/test').Page} page 
   */
  constructor(page) {
    this.page = page;
    this.startButton = page.getByRole('button', { name: /get started|resume/i });
    this.nextButton = page.getByRole('button', { name: /next/i });
    this.finishButton = page.getByRole('button', { name: /finish|complete/i });
    this.singleSelectOptions = page.locator('.MuiRadio-root').or(page.getByRole('radio'));
    this.multiSelectOptions = page.locator('.MuiCheckbox-root').or(page.getByRole('checkbox'));
    this.inputFields = page.locator('input[type="text"]');
    this.tagInputField = page.locator('.MuiChip-root');
  }

  async goto() {
    await this.page.goto('/portal/onboarding');
  }

  async startOnboarding() {
    await this.startButton.click();
  }

  async selectSingleOption(optionIndex = 0) {
    const options = await this.singleSelectOptions.all();
    if (options.length > optionIndex) {
      await options[optionIndex].click();
    }
  }

  async selectMultipleOptions(optionIndices = [0, 1]) {
    const options = await this.multiSelectOptions.all();
    for (const index of optionIndices) {
      if (options.length > index) {
        await options[index].click();
      }
    }
  }

  async fillTextField(text, fieldIndex = 0) {
    const fields = await this.inputFields.all();
    if (fields.length > fieldIndex) {
      await fields[fieldIndex].fill(text);
    }
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async completeOnboarding() {
    await this.startOnboarding();
    
    // For each step, select options and click next
    // The exact number of steps may vary based on your application
    for (let i = 0; i < 5; i++) {
      // Attempt to select different types of inputs
      try {
        await this.selectSingleOption();
      } catch (e) {
        // Not a single select step
      }
      
      try {
        await this.selectMultipleOptions();
      } catch (e) {
        // Not a multi-select step
      }
      
      try {
        await this.fillTextField(`Test input ${i}`);
      } catch (e) {
        // Not a text input step
      }
      
      // Try to find and click next (or finish on the last step)
      try {
        if (i === 4) {
          await this.clickFinish();
        } else {
          await this.clickNext();
        }
      } catch (e) {
        console.log(`Could not find next/finish button on step ${i}`);
        break;
      }
    }
  }
}

module.exports = {
  SignupPage,
  OnboardingPage
};