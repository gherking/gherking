import { DataTable, Step } from "gherkin-ast";
import { PreCompiler } from "./PreCompiler";
import { Processor } from "./Processor";
import { TableRowProcessor } from "./TableRowProcessor";

export class DataTableProcessor extends Processor<DataTable, Step> {
    private tableRowProcessor: TableRowProcessor<DataTable>

    constructor(preCompiler: Partial<PreCompiler>) {
        super(preCompiler);
        this.tableRowProcessor = new TableRowProcessor<DataTable>(preCompiler);
    }

    protected preFilter(e: DataTable, p: Step): boolean {
        return !this.preCompiler.preDataTable || this.preCompiler.preDataTable(e, p);
    }
    protected postFilter(e: DataTable, p: Step): boolean {
        return !this.preCompiler.postDataTable || this.preCompiler.postDataTable(e, p);
    }
    protected process(e: DataTable, p: Step): DataTable {
        let dataTable = e;
        if (this.preCompiler.onDataTable) {
            dataTable = this.preCompiler.onDataTable(e, p);
        }
        if (dataTable) {
            dataTable.rows = this.tableRowProcessor.execute(dataTable.rows, dataTable);
        }
        return dataTable;
    }
}