import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { login, deleteAllIncomes, deleteAllExpenses } from './api-utils';

dotenv.config();

test.describe('API Tests', () => {
    const baseURL = process.env.API_BASE_URL_V2!;
    const authURL = process.env.API_BASE_URL!;
    const username = process.env.API_TEST_USER!;
    const password = process.env.API_TEST_PASSWORD!;

    test.beforeEach(async ({ request }) => {
        await login(request, authURL, username, password);
    });

    test.afterEach(async ({ request }) => {
        await deleteAllIncomes(request, baseURL);
        await deleteAllExpenses(request, baseURL);
    });

    test('Add income and verify it appears in GET', async ({ request }) => {
        await test.step('Add income', async () => {
            const payload = {
                date: '2025-12-24',
                income: '1000',
                currency: 'UAH',
                comment: 'Test income 001',
                cash: false
            };
            const addResponse = await request.post(`${baseURL}/incomes/add`, { data: payload });
            expect(addResponse.status()).toBeLessThan(202);
        });

        await test.step('Verify income appears in GET', async () => {
            const getResponse = await request.get(`${baseURL}/incomes`);
            expect(getResponse.ok()).toBeTruthy();

            const incomes = await getResponse.json();
            expect(incomes[0].income).toBe(1000);
            expect(incomes[0].comment).toBe('Test income 001');
        });
    });

    test('Add expense and verify it appears in GET', async ({ request }) => {
        await test.step('Add expense', async () => {
            const payload = {
                date: '2025-12-24',
                expense: '500',
                currency: 'UAH',
                comment: 'Test expense 001',
                cash: false
            };
            const addResponse = await request.post(`${baseURL}/expenses/add`, { data: payload });
            expect(addResponse.status()).toBeLessThan(202);
        });

        await test.step('Verify expense appears in GET', async () => {
            const getResponse = await request.get(`${baseURL}/expenses`);
            expect(getResponse.ok()).toBeTruthy();

            const expenses = await getResponse.json();
            expect(expenses[0].expense).toBe(500);
            expect(expenses[0].comment).toBe('Test expense 001');
        });
    });

    test('Add income and expense, verify taxes reflect changes', async ({ request }) => {
        await test.step('Add income', async () => {
            const incomePayload = {
                date: '2025-12-24',
                income: '10000',
                currency: 'UAH',
                comment: 'Test income for taxes',
                cash: false
            };

            const incomeResponse = await request.post(`${baseURL}/incomes/add`, {
                data: incomePayload
            });
            expect(incomeResponse.status()).toBeLessThan(202);
        });

        await test.step('Add expense', async () => {
            const expensePayload = {
                date: '2025-12-24',
                expense: '2000',
                currency: 'UAH',
                comment: 'Test expense for taxes',
                cash: false
            };

            const expenseResponse = await request.post(`${baseURL}/expenses/add`, { data: expensePayload });
            expect(expenseResponse.status()).toBeLessThan(202);
        });

        await test.step('Get pending taxes', async () => {
            const taxesResponse = await request.get(`${baseURL}/taxes/pending`);
            expect(taxesResponse.ok()).toBeTruthy();

            const taxes = await taxesResponse.json();
            expect(taxes[0].amountEP).toBeGreaterThan(0);
            expect(taxes[0].amountMilitaryTax).toBeGreaterThan(0);
            expect(taxes[0].sumIncomes).toBe(10000);
            expect(taxes[0].sumExpenses).toBe(2000);
        });
    });
});
