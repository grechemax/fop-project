import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    //TODO: change 1 to higher number to speed up tests on CI
    workers: 1, // Run tests serially
    reporter: process.env.CI ? 'blob' : [['html', { open: 'never' }], ['list']],
    /* Shared settings for all the projects below. */
    use: {
        baseURL: process.env.BASE_URL,
        headless: true,
        trace: 'on-first-retry',
        extraHTTPHeaders: { Accept: 'application/json' }
    },

    projects: [
        {
            name: 'chromium',
            testMatch: /.*\/e2e\/.*\.test\.ts/,
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'api',
            testMatch: /.*\/api\/.*\.spec\.ts/
        }
    ]
});
