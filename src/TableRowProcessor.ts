import { DataTable, Examples, TableRow } from "gherkin-ast";
import { getDebugger } from './debug';
import { MultiControlType } from "./PreCompiler";
import { ListProcessor } from "./Processor";

const tableRowDebug = getDebugger("TableRowProcessor");

export class TableRowProcessor<P extends DataTable | Examples> extends ListProcessor<TableRow, P> {
    protected preFilter(e: TableRow, p: P, i: number): boolean {
        tableRowDebug("preFilter(hasPreTableRow: %s, i: %d)", !!this.preCompiler.preTableRow, i);
        return !this.preCompiler.preTableRow || this.preCompiler.preTableRow(e, p, i);
    }
    protected postFilter(e: TableRow, p: P, i: number): boolean {
        tableRowDebug("postFilter(hasPostTableRow: %s, i: %d)", !!this.preCompiler.postTableRow, i);
        return !this.preCompiler.postTableRow || this.preCompiler.postTableRow(e, p, i);
    }
    protected process(e: TableRow, p: P, i: number): MultiControlType<TableRow> {
        tableRowDebug("process(hasOnTableRow: %s, i: %d)", !!this.preCompiler.onTableRow, i);
        if (this.preCompiler.onTableRow) {
            return this.preCompiler.onTableRow(e, p, i);
        }
    }
}