import { test, expect } from '../../src/fixtures/fop-fixture';

test.describe('Income tests', () => {
    test.afterEach(async ({ incomePage }) => {
        await incomePage.deleteAllVisibleIncomes();
    });
    const uniqueId = `test-${Date.now()}`;

    test('should display correct total income amount', async ({ incomePage }) => {
        await incomePage.addIncome('1', 'UAH', `Income A ${uniqueId}`);
        await incomePage.addIncome('123', 'UAH', `Income B ${uniqueId}`);
        await incomePage.addIncome('345.5', 'UAH', `Income C ${uniqueId}`);

        await incomePage.assertIncomeTableVisible();
        expect(await incomePage.getTotalIncomeText()).toContain('469,5');
    });

    test('should update total when deleting a single income entry', async ({ incomePage }) => {
        await incomePage.addIncome('100', 'UAH', `Update total test A ${uniqueId}`);
        await incomePage.addIncome('200', 'UAH', `Update total test B ${uniqueId}`);
        await incomePage.addIncome('300', 'UAH', `Update total test C ${uniqueId}`);

        await incomePage.deleteIncomeByComment(`Update total test A ${uniqueId}`);
        expect(await incomePage.getTotalIncomeText()).toContain('500');
    });

    test('income table should be hidden when all incomes are deleted', async ({ incomePage }) => {
        await incomePage.assertIncomeTableNotVisible();

        await incomePage.addIncome('100', 'UAH', `Table visibility test ${uniqueId}`);
        await incomePage.assertIncomeTableVisible();

        await incomePage.deleteIncomeByComment(`Table visibility test ${uniqueId}`);
        await incomePage.assertIncomeTableNotVisible();
    });
});
