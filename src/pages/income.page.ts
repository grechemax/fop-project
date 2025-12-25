import { BasePage } from './base-page';

export class IncomePage extends BasePage {
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

    public async addIncome(amount: string, currency: string, comment: string): Promise<void> {
        await this.clickAddIncome();
        await this.waitForModalAppeared();
        await this.enterIncome(amount);
        await this.selectCurrency(currency);
        await this.fillComment(comment);
        await this.submitIncomeForm();
        await this.waitForModalDisappeared();
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

    public async deleteAllVisibleIncomes(): Promise<void> {
        // Check if table exists
        const tableExists = await this.incomeTableContainer.isVisible().catch(() => false);
        if (!tableExists) {
            return;
        }

        // Get all comment cells to know what to delete
        const commentCells = this.page.locator('.comment-cell');
        const count = await commentCells.count();

        if (count === 0) {
            return;
        }

        // Delete each one by clicking first delete button
        for (let i = 0; i < count; i++) {
            // Set up dialog handler before clicking
            this.page.once('dialog', async (dialog) => {
                if (dialog.type() === 'confirm') {
                    await dialog.accept();
                }
            });

            const firstDeleteBtn = this.deleteButton.first();
            if (await firstDeleteBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                await firstDeleteBtn.click();
                await this.page.waitForTimeout(500);
            }
        }
    }
}
