import { BasePage } from './base-page';

export class ExpensePage extends BasePage {
    public readonly expenseModalTitle = this.page.locator('.modal-title');
    public readonly addExpenseButton = this.page.locator('.add-button');
    public readonly expenseAmountInput = this.page.locator('#amount');
    public readonly currency = this.page.locator('#currency');
    public readonly comment = this.page.locator('#comment');
    public readonly submitButton = this.page.locator('button[type="submit"]');
    public readonly expenseTableContainer = this.page.locator('.expenses-table-container');
    public readonly totalAmount = this.page.locator('.total-amount');
    public readonly deleteButton = this.page.locator('button.action-btn.delete-btn');

    public async clickAddExpense(): Promise<void> {
        await this.addExpenseButton.click();
    }

    public async getAddExpenseModalTitle(): Promise<string> {
        await this.expenseModalTitle.waitFor({ state: 'visible', timeout: 10000 });
        return (await this.expenseModalTitle.textContent()) || '';
    }

    public async enterExpense(amount: string): Promise<void> {
        await this.expenseAmountInput.fill(amount);
    }

    public async selectCurrency(currency: string): Promise<void> {
        await this.currency.selectOption(currency);
    }

    public async fillComment(comment: string): Promise<void> {
        await this.comment.fill(comment);
    }

    public async submitExpenseForm(): Promise<void> {
        await this.submitButton.click();
    }

    public async addExpense(amount: string, currency: string, comment: string): Promise<void> {
        await this.clickAddExpense();
        await this.waitForModalAppeared();
        await this.enterExpense(amount);
        await this.selectCurrency(currency);
        await this.fillComment(comment);
        await this.submitExpenseForm();
        await this.waitForModalDisappeared();
    }

    public async waitForModalAppeared(): Promise<void> {
        await this.assertElementVisible(this.expenseModalTitle);
    }

    public async waitForModalDisappeared(): Promise<void> {
        await this.assertElementNotVisible(this.expenseModalTitle);
    }

    public async getTotalExpenseText(): Promise<string> {
        await this.totalAmount.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.totalAmount.textContent()) || '';
    }

    public async assertExpenseTableVisible(): Promise<void> {
        await this.assertElementVisible(this.expenseTableContainer);
    }

    public async assertExpenseTableNotVisible(): Promise<void> {
        await this.assertElementNotVisible(this.expenseTableContainer);
    }

    public async deleteExpenseByComment(commentText: string): Promise<void> {
        const expenseRow = this.page.locator(`//tr[./td[contains(@class, 'comment-cell') and contains(., '${commentText}')]]`);

        this.page.once('dialog', async (dialog) => {
            if (dialog.type() === 'confirm') {
                await dialog.accept();
                console.log(`Confirmed deletion dialog for comment: ${dialog.message()}`);
            }
        });

        await expenseRow.locator(this.deleteButton).click();

        await this.page.waitForTimeout(500);
    }

    public async deleteAllVisibleExpenses(): Promise<void> {

        const tableExists = await this.expenseTableContainer.isVisible().catch(() => false);
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
