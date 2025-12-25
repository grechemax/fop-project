import 'dotenv/config';
import { test as base, expect, Page, Browser } from '@playwright/test';
import { IncomePage } from '../pages/income.page';
import { TaxesPage } from '../pages/taxes.page';
import * as fs from 'fs';
import { LoginComponent } from '../pages/components/login.component';
import { ExpensePage } from '../pages/expense.page';

interface FopFixture {
    seededIncomePage: IncomePage;
    authenticatedPage: Page;
    expensePage: ExpensePage;
    incomePage: IncomePage;
    taxesPage: TaxesPage;
}

const storageState = (workerId: number): string => `./storageStates/storageState${workerId}.json`;

async function authenticateApp(browser: Browser, workerId: number): Promise<void> {
    if (fs.existsSync(storageState(workerId))) {
        fs.unlinkSync(storageState(workerId));
        console.log(`Deleted existing storage state: ${storageState(workerId)}`);
    }

    const context = await browser.newContext();
    const page = await context.newPage();
    const incomePage = new IncomePage(page);
    const loginComponent = new LoginComponent(page);

    await incomePage.navigate('/');
    await incomePage.waitForLoad();

    await loginComponent.clickLoginButton();
    await loginComponent.assertModalVisible();
    await loginComponent.login(process.env.TEST_USER!, process.env.TEST_PASSWORD!);

    await incomePage.waitForLoad();

    await expect(loginComponent.loginButton).not.toBeVisible({ timeout: 10000 });

    await page.context().storageState({ path: storageState(workerId) });
    console.log(`authenticated storage state saved to ${storageState(workerId)}`);

    await context.close();
}

export const test = base.extend<FopFixture>({
    authenticatedPage: async ({ browser }, use) => {
        const workerId = test.info().workerIndex;
        await authenticateApp(browser, workerId);

        const context = await browser.newContext({ storageState: storageState(workerId) });
        const page = await context.newPage();

        await use(page);

        await page.close();
        await context.close();
    },

    seededIncomePage: async ({ authenticatedPage }, use) => {
        const incomePage = new IncomePage(authenticatedPage);
        await incomePage.navigate('/incomes');
        await incomePage.waitForLoad();

        const testIncomes = [
            { amount: '100', currency: 'UAH', comment: 'Test income A' },
            { amount: '200', currency: 'UAH', comment: 'Test income B' },
            { amount: '300', currency: 'UAH', comment: 'Test income C' }
        ];

        for (const income of testIncomes) {
            await incomePage.clickAddIncome();
            await incomePage.waitForModalAppeared();
            await incomePage.enterIncome(income.amount);
            await incomePage.selectCurrency(income.currency);
            await incomePage.fillComment(income.comment);
            await incomePage.submitIncomeForm();
            await incomePage.waitForModalDisappeared();
        }

        await use(incomePage);
    },

    incomePage: async ({ authenticatedPage }, use) => {
        const incomePage = new IncomePage(authenticatedPage);
        await incomePage.navigate('/incomes');
        await use(incomePage);
    },

    taxesPage: async ({ authenticatedPage }, use) => {
        const taxesPage = new TaxesPage(authenticatedPage);
        await use(taxesPage);
    },

    expensePage: async ({ authenticatedPage }, use) => {
        const expensePage = new ExpensePage(authenticatedPage);
        await expensePage.navigate('/expenses');
        await use(expensePage);
    }
});

export { expect };
