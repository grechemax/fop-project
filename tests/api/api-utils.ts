import { APIRequestContext, expect } from '@playwright/test';

export async function login(request: APIRequestContext, authURL: string, username: string, password: string): Promise<void> {
    const loginUrl = `${authURL}/react/authenticate/login`;

    const response = await request.post(loginUrl, {
        data: {
            username,
            password
        }
    });

    if (!response.ok()) {
        const responseText = await response.text();
        throw new Error(`Login failed with status ${response.status()}: ${responseText}`);
    }
}

export async function deleteAllIncomes(request: APIRequestContext, baseURL: string): Promise<void> {
    const response = await request.get(`${baseURL}/incomes`);

    if (!response.ok()) {
        console.log(`Failed to get incomes: ${response.status()}`);
        return;
    }

    const text = await response.text();
    if (!text) {
        return;
    }

    const body = JSON.parse(text);
    if (body.length > 0) {
        for (const income of body) {
            const deleteResponse = await request.post(`${baseURL}/incomes/delete`, {
                data: { id: income.id }
            });
            expect(deleteResponse.status()).toBeLessThan(202);
        }
    }
}

export async function deleteAllExpenses(request: APIRequestContext, baseURL: string): Promise<void> {
    const response = await request.get(`${baseURL}/expenses`);

    if (!response.ok()) {
        console.log(`Failed to get expenses: ${response.status()}`);
        return;
    }

    const text = await response.text();
    if (!text) {
        return;
    }

    const body = JSON.parse(text);
    if (body.length > 0) {
        for (const expense of body) {
            const deleteResponse = await request.post(`${baseURL}/expenses/delete`, {
                data: { id: expense.id }
            });
            expect(deleteResponse.status()).toBeLessThan(202);
        }
    }
}
