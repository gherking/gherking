import { Examples, ScenarioOutline } from "gherkin-ast";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { ListProcessor } from "./Processor";
import { TableRowProcessor } from "./TableRowProcessor";
import { TagProcessor } from "./TagProcessor";

export class ExamplesProcessor extends ListProcessor<Examples, ScenarioOutline> {
    private tagsProcessor: TagProcessor<Examples>;
    private tableRowProcessor: TableRowProcessor<Examples>;

    constructor(preCompiler?: Partial<PreCompiler>) {
        super(preCompiler);
        this.tagsProcessor = new TagProcessor<Examples>(preCompiler);
        this.tableRowProcessor = new TableRowProcessor<Examples>(preCompiler);
    }

    protected preFilter(e: Examples, p: ScenarioOutline, i: number): boolean {
        return !this.preCompiler.preExamples || this.preCompiler.preExamples(e, p, i);
    }
    protected postFilter(e: Examples, p: ScenarioOutline, i: number): boolean {
        return !this.preCompiler.postExamples || this.preCompiler.postExamples(e, p, i);
    }
    protected process(e: Examples, p: ScenarioOutline, i: number): MultiControlType<Examples> {
        let examples: MultiControlType<Examples> = e;
        if (this.preCompiler.onExamples) {
            examples = this.preCompiler.onExamples(e, p, i);
        }
        if (examples) {
            if (Array.isArray(examples)) {
                examples = examples.map(this.postProcess.bind(this));
            } else {
                examples = this.postProcess(examples);
            }
        }
        return examples;
    }

    private postProcess(e: Examples): Examples {
        e.tags = this.tagsProcessor.execute(e.tags, e);
        e.body = this.tableRowProcessor.execute(e.body, e);
        return e;
    }
}