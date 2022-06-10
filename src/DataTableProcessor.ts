import { DataTable, Step } from "gherkin-ast";
import { PreCompiler, SingleControlType } from "./PreCompiler";
import { Processor } from "./Processor";
import { TableRowProcessor } from "./TableRowProcessor";
import { getDebugger } from "./debug";

const debug = getDebugger("DataTableProcessor");

export class DataTableProcessor extends Processor<DataTable, Step> {
    private tableRowProcessor: TableRowProcessor<DataTable>

    constructor(preCompiler?: Partial<PreCompiler>) {
        debug("constructor(%o)", preCompiler);
        super(preCompiler);
        this.tableRowProcessor = new TableRowProcessor<DataTable>(preCompiler);
    }

    protected async preFilter(e: DataTable, p: Step): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "preFilter(hasPreDataTable: %s, e: %s, p: %s)", 
            !!this.preCompiler.postDataTable, e?.constructor.name, p?.constructor.name
        );
        return !this.preCompiler.preDataTable || await this.preCompiler.preDataTable(e, p);
    }
    protected async postFilter(e: DataTable, p: Step): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "postFilter(hasPostDataTable: %s, e: %s, p: %s)", 
            !!this.preCompiler.postDataTable, e?.constructor.name, p?.constructor.name
        );
        return !this.preCompiler.postDataTable || await this.preCompiler.postDataTable(e, p);
    }
    protected async process(e: DataTable, p: Step): Promise<SingleControlType<DataTable>> {
        /* istanbul ignore next */
        debug(
            "process(hasOnDataTable: %s, e: %s, p: %s)", 
            !!this.preCompiler.onDataTable, e?.constructor.name, p?.constructor.name
        );
        let dataTable: SingleControlType<DataTable> = e;
        if (this.preCompiler.onDataTable) {
            const result = await this.preCompiler.onDataTable(e, p);
            if (typeof result !== "undefined") {
                dataTable = result;
            }
        }
        if (dataTable) {
            debug("...rows %s", Array.isArray(dataTable.rows));
            dataTable.rows = await this.tableRowProcessor.execute(dataTable.rows, dataTable);
        }
        return dataTable;
    }
}