import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
    public readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    public async navigate(path: string): Promise<void> {
        await this.page.goto(path);
    }
    public async assertModalVisible(modal: Locator, form?: Locator): Promise<void> {
        await expect(modal).toBeVisible();
        if (form) {
            await expect(form).toBeVisible();
        }
    }

    public async waitForLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }
    public async isElementPresent(locator: Locator, timeout = 5000): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'attached', timeout });
            return true;
        } catch {
            return false;
        }
    }

    public async isElementVisible(locator: Locator, timeout = 5000): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    public async assertElementPresent(locator: Locator): Promise<void> {
        await expect(locator).toBeAttached();
    }

    public async assertElementVisible(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
    }

    public async isElementNotVisible(locator: Locator, timeout = 5000): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'hidden', timeout });
            return true;
        } catch {
            return false;
        }
    }

    public async assertElementNotVisible(locator: Locator): Promise<void> {
        await expect(locator).not.toBeVisible();
    }
}
