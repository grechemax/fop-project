import { BasePage } from './base-page';

export class TaxesPage extends BasePage {
    public readonly filterTotalTax = this.page.locator('.filter-summary .tax-total');
    public readonly taxTableContainer = this.page.locator('.taxes-table-container');
    public readonly tableTotalTax = this.page.locator('.summary-stats .quarter-totals .total-item:nth-child(2)');

    public async assertFilterTotalTaxVisible(): Promise<void> {
        await this.assertElementVisible(this.filterTotalTax);
    }

    public async assertFilterTotalTaxNotVisible(): Promise<void> {
        await this.assertElementNotVisible(this.filterTotalTax);
    }

    public async assertTaxTableVisible(): Promise<void> {
        await this.assertElementVisible(this.taxTableContainer);
    }

    public async assertTaxTableNotVisible(): Promise<void> {
        await this.assertElementNotVisible(this.taxTableContainer);
    }

    public async getTotalTaxText(): Promise<string> {
        await this.tableTotalTax.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.tableTotalTax.textContent()) || '';
    }
}
