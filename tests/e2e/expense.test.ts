import { test, expect } from '../../src/fixtures/fop-fixture';
import { ExpensePage } from '../../src/pages/expense.page';

test.describe('Expense tests', () => {
    let expensePage: ExpensePage;

    test.beforeEach(async ({ authenticatedPage }) => {
        expensePage = new ExpensePage(authenticatedPage);
        await expensePage.navigate('/expenses');
    });

    test.afterEach(async () => {
        await expensePage.deleteAllVisibleExpenses();
    });

    const uniqueId = `test-${Date.now()}`;

    test('should display correct total expense amount', async () => {
        await expensePage.addExpense('100', 'UAH', `Expense A ${uniqueId}`);
        await expensePage.addExpense('200', 'UAH', `Expense B ${uniqueId}`);
        await expensePage.addExpense('300', 'UAH', `Expense C ${uniqueId}`);

        // Verify
        await expensePage.assertExpenseTableVisible();
        const totalAmount = await expensePage.getTotalExpenseText();
        expect(totalAmount).toContain('600');
    });

    test('should update total when deleting a single expense entry', async () => {
        await expensePage.addExpense('100', 'UAH', `Delete test A ${uniqueId}`);
        await expensePage.addExpense('200', 'UAH', `Delete test B ${uniqueId}`);
        await expensePage.addExpense('300', 'UAH', `Delete test C ${uniqueId}`);

        // Delete one entry and verify total updated
        await expensePage.deleteExpenseByComment(`Delete test A ${uniqueId}`);
        const totalAmount = await expensePage.getTotalExpenseText();
        expect(totalAmount).toContain('500');
    });

    test('should NOT display expense table when all entries are deleted', async () => {
        await expensePage.addExpense('100', 'UAH', `Delete all A ${uniqueId}`);
        await expensePage.addExpense('200', 'UAH', `Delete all B ${uniqueId}`);

        // Delete all entries
        await expensePage.deleteExpenseByComment(`Delete all A ${uniqueId}`);
        await expensePage.deleteExpenseByComment(`Delete all B ${uniqueId}`);

        // Verify table is not visible
        await expensePage.assertExpenseTableNotVisible();
    });
});
