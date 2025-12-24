import { expect, Page } from '@playwright/test';

export class LoginComponent {
    public constructor(private readonly page: Page) {}

    public readonly loginButton = this.page.locator('.signin-button');
    public readonly modalForm = this.page.locator('.login-modal-form');

    public readonly emailInput = this.page.locator('input[type="email"]');
    public readonly passwordInput = this.page.locator('input[type="password"]');
    public readonly submitButton = this.page.locator('button[type="submit"]');

    public async assertModalVisible(): Promise<void> {
        await expect(this.modalForm).toBeVisible();
    }

    public async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    public async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }
}
