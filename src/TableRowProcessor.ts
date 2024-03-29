import { DataTable, Examples, TableRow } from "gherkin-ast";
import { getDebugger } from "./debug";
import { MultiControlType } from "./PreCompiler";
import { ListProcessor } from "./Processor";

const debug = getDebugger("TableRowProcessor");

export class TableRowProcessor<P extends DataTable | Examples> extends ListProcessor<TableRow, P> {
    protected async preFilter(e: TableRow, p: P, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "preFilter(hasPreTableRow: %s, e: %s, p: %s, i: %d)", 
            !!this.preCompiler.preTableRow, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.preTableRow || await this.preCompiler.preTableRow(e, p, i);
    }
    protected async postFilter(e: TableRow, p: P, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "postFilter(hasPostTableRow: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.postTableRow, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.postTableRow || await this.preCompiler.postTableRow(e, p, i);
    }
    protected async process(e: TableRow, p: P, i: number): Promise<MultiControlType<TableRow>> {
        /* istanbul ignore next */
        debug(
            "process(hasOnTableRow: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.onTableRow, e?.constructor.name, p?.constructor.name, i
        );
        if (this.preCompiler.onTableRow) {
            return this.preCompiler.onTableRow(e, p, i);
        }
    }
}