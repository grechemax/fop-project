import { test, expect } from '../../src/fixtures/fop-fixture';

test.describe('Tax tests', () => {
    test.afterEach(async ({ incomePage }) => {
        await incomePage.deleteAllVisibleIncomes();
    });

    test('should NOT display tax without any incomes', async ({ taxesPage }) => {
        await taxesPage.navigate('/taxes/all');
        await taxesPage.waitForLoad();
        await taxesPage.assertTaxTableNotVisible();
        await taxesPage.assertFilterTotalTaxNotVisible();
    });

    test('should display tax after adding income', async ({ incomePage, taxesPage }) => {
        await incomePage.addIncome('100', 'UAH', 'Add income for tax test');
        await taxesPage.navigate('/taxes/all');
        await taxesPage.waitForLoad();
        await taxesPage.assertTaxTableVisible();
        await taxesPage.assertFilterTotalTaxVisible();
        expect(await taxesPage.getTotalTaxText()).toContain('Податки');
    });
});
