// import { expect } from '@playwright/test';
import { BasePage } from './base-page';
// import { logStep } from '../utils/customUtils';

export class TaxesPage extends BasePage {
    public readonly totalTax = this.page.locator('.tax-total span.summary-value');
    public readonly taxTableContainer = this.page.locator('.taxes-table-container');

    public async assertTaxTableVisible(): Promise<void> {
        await this.assertElementVisible(this.taxTableContainer);
    }

    public async assertTaxTableNotVisible(): Promise<void> {
        await this.assertElementNotVisible(this.taxTableContainer);
    }

    public async getTotalTaxText(): Promise<string> {
        await this.totalTax.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.totalTax.textContent()) || '';
    }

    // public async assertModalVisible(): Promise<void> {
    //     await expect(this.loginModal).toBeVisible();
    //     await expect(this.modalTitle).toBeVisible();
    // }

    // public async fillLoginForm(email: string, password: string): Promise<void> {
    //     await this.emailInput.fill(email);
    //     await this.passwordInput.fill(password);
    //     // await logStep('Filled login form');
    // }

    // public async submitLogin(): Promise<void> {
    //     await this.submitButton.click();
    //     // Assert success/error (e.g., await expect(this.page).toHaveURL(/dashboard/)) if login redirects; else check message
    // }

    // public async assertPageContent(): Promise<void> {
    //     await expect(this.pageHeading).toBeVisible();
    //     // Add more: e.g., expect specific tax info text
    // }
}
