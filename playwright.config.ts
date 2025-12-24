import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: false, // Disable parallel execution to control test order
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Run tests serially
    reporter: [['html', { open: 'never' }], ['list']],
    /* Shared settings for all the projects below. */
    use: {
        baseURL: process.env.BASE_URL,
        headless: !!process.env.CI,
        trace: 'on-first-retry',
        extraHTTPHeaders: { Accept: 'application/json' }
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ]
});
