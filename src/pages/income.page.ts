// import { expect } from '@playwright/test';
import { BasePage } from './base-page';

export class IncomePage extends BasePage {
    public readonly loginModal = this.page.locator('.modal');
    public readonly modalForm = this.page.locator('.login-modal-form');
    public readonly pageHeading = this.page.getByRole('heading', { name: /Податки|Taxes/i });
    public readonly incomeModalTitle = this.page.locator('.modal-title');
    public readonly addIncomeButton = this.page.locator('.add-button');
    public readonly incomeAmountInput = this.page.locator('#amount');
    public readonly currency = this.page.locator('#currency');
    public readonly comment = this.page.locator('#comment');
    public readonly submitButton = this.page.locator('button[type="submit"]');
    public readonly incomeTableContainer = this.page.locator('.income-table-container');
    public readonly totalAmount = this.page.locator('.total-amount');
    public readonly deleteButton = this.page.locator('button.action-btn.delete-btn');

    public async clickAddIncome(): Promise<void> {
        await this.addIncomeButton.click();
    }

    public async getAddIncomeModalTitle(): Promise<string> {
        await this.incomeModalTitle.waitFor({ state: 'visible', timeout: 10000 });
        return (await this.incomeModalTitle.textContent()) || '';
    }

    public async enterIncome(amount: string): Promise<void> {
        await this.incomeAmountInput.fill(amount);
    }

    public async selectCurrency(currency: string): Promise<void> {
        await this.currency.selectOption(currency);
    }

    public async fillComment(comment: string): Promise<void> {
        await this.comment.fill(comment);
    }

    public async submitIncomeForm(): Promise<void> {
        await this.submitButton.click();
    }

    public async waitForModalAppeared(): Promise<void> {
        await this.assertElementVisible(this.incomeModalTitle);
    }
    public async waitForModalDisappeared(): Promise<void> {
        await this.assertElementNotVisible(this.incomeModalTitle);
    }

    public async getTotalIncomeText(): Promise<string> {
        await this.totalAmount.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.totalAmount.textContent()) || '';
    }

    public async assertIncomeTableVisible(): Promise<void> {
        await this.assertElementVisible(this.incomeTableContainer);
    }

    public async assertIncomeTableNotVisible(): Promise<void> {
        await this.assertElementNotVisible(this.incomeTableContainer);
    }

    public async deleteIncomeByComment(commentText: string): Promise<void> {
        const incomeRow = this.page.locator(`//tr[./td[contains(@class, 'comment-cell') and contains(., '${commentText}')]]`);

        // Set up dialog handler before clicking
        this.page.once('dialog', async (dialog) => {
            if (dialog.type() === 'confirm') {
                await dialog.accept();
                console.log(`Confirmed deletion dialog for comment: ${dialog.message()}`);
            }
        });

        await incomeRow.locator(this.deleteButton).click();

        // Wait for the record to be removed from the DOM
        await this.page.waitForTimeout(500);
    }
}
