import { DataTable, Examples, TableRow } from "gherkin-ast";
import { MultiControlType } from "./PreCompiler";
import { ListProcessor } from "./Processor";

export class TableRowProcessor<P extends DataTable | Examples> extends ListProcessor<TableRow, P> {
    protected preFilter(e: TableRow, p: P, i: number): boolean {
        return !this.preCompiler.preTableRow || this.preCompiler.preTableRow(e, p, i);
    }
    protected postFilter(e: TableRow, p: P, i: number): boolean {
        return !this.preCompiler.postTableRow || this.preCompiler.postTableRow(e, p, i);
    }
    protected process(e: TableRow, p: P, i: number): MultiControlType<TableRow> {
        if (this.preCompiler.onTableRow) {
            return this.preCompiler.onTableRow(e, p, i);
        }
    }
}