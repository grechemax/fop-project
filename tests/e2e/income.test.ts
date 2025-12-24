import { test, expect } from '../../src/fixtures/fop-fixture';

test.describe('Income tests', () => {
    test.describe.configure({ mode: 'serial' });

    test('should display correct total income amount of 600 after adding three income entries', async ({
        seededIncomePage: incomePage
    }) => {
        await incomePage.assertIncomeTableVisible();

        const totalAmount = await incomePage.getTotalIncomeText();
        expect(totalAmount).toContain('600');
    });

    test('should calculate and display total tax', async ({ taxesPage }) => {
        await taxesPage.assertTaxTableVisible();
        const totalTax = await taxesPage.getTotalTaxText();
        expect(totalTax).toContain('796');
    });

    test('should update total when deleting a single income entry', async ({ incomePage }) => {
        await incomePage.deleteIncomeByComment('Test income A');
        const totalAmount = await incomePage.getTotalIncomeText();

        expect(totalAmount).toContain('500');
    });

    test('should NOT display income table when all remaining income entries are deleted', async ({ incomePage }) => {
        const testComments = ['Test income B', 'Test income C'];
        for (const comment of testComments) {
            await incomePage.deleteIncomeByComment(comment);
        }
        await incomePage.assertIncomeTableNotVisible();
    });

    test('should NOT display tax table when all income entries have been deleted', async ({ taxesPage }) => {
        await taxesPage.navigate('/taxes');
        await taxesPage.assertTaxTableNotVisible();
    });
});
