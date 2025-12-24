import { expect, Locator, Page } from '@playwright/test';
// import { logStep } from '../utils/customUtils';

export class BasePage {
    public readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    public async navigate(path: string): Promise<void> {
        await this.page.goto(path);
        // await logStep(`Navigated to ${path}`);
    }

    /**
     * Generic modal assertion for any page.
     * @param modal The modal locator
     * @param form Optional: the form or content locator inside the modal
     */
    public async assertModalVisible(modal: Locator, form?: Locator): Promise<void> {
        await expect(modal).toBeVisible();
        if (form) {
            await expect(form).toBeVisible();
        }
    }

    public async waitForLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Generic method to check if an element is present
     * @param locator The element locator from POM
     * @param timeout Optional timeout in milliseconds
     * @returns true if element is present, false otherwise
     */
    public async isElementPresent(locator: Locator, timeout = 5000): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'attached', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Generic method to check if an element is visible
     * @param locator The element locator from POM
     * @param timeout Optional timeout in milliseconds
     * @returns true if element is visible, false otherwise
     */
    public async isElementVisible(locator: Locator, timeout = 5000): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Generic assertion for element presence
     * @param locator The element locator from POM
     */
    public async assertElementPresent(locator: Locator): Promise<void> {
        await expect(locator).toBeAttached();
    }

    /**
     * Generic assertion for element visibility
     * @param locator The element locator from POM
     */
    public async assertElementVisible(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
    }

    /**
     * Generic method to check if an element is not visible
     * @param locator The element locator from POM
     * @param timeout Optional timeout in milliseconds
     * @returns true if element is not visible, false otherwise
     */
    public async isElementNotVisible(locator: Locator, timeout = 5000): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'hidden', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Generic assertion that element is not visible
     * @param locator The element locator from POM
     */
    public async assertElementNotVisible(locator: Locator): Promise<void> {
        await expect(locator).not.toBeVisible();
    }
}
