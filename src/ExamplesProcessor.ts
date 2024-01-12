import { Examples, ScenarioOutline } from "gherkin-ast";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { ListProcessor } from "./Processor";
import { TableRowProcessor } from "./TableRowProcessor";
import { TagProcessor } from "./TagProcessor";
import { getDebugger } from "./debug";

const debug = getDebugger("ExamplesProcessor");

export class ExamplesProcessor extends ListProcessor<Examples, ScenarioOutline> {
    private tagsProcessor: TagProcessor<Examples>;
    private tableRowProcessor: TableRowProcessor<Examples>;

    constructor(preCompiler?: Partial<PreCompiler>) {
        debug("constructor(%o)", preCompiler);
        super(preCompiler);
        this.tagsProcessor = new TagProcessor<Examples>(preCompiler);
        this.tableRowProcessor = new TableRowProcessor<Examples>(preCompiler);
    }

    protected async preFilter(e: Examples, p: ScenarioOutline, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "preFilter(hasPreExamples: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.preExamples, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.preExamples || await this.preCompiler.preExamples(e, p, i);
    }
    protected async postFilter(e: Examples, p: ScenarioOutline, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "postFilter(hasPostExamples: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.postExamples, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.postExamples || await this.preCompiler.postExamples(e, p, i);
    }
    protected async process(e: Examples, p: ScenarioOutline, i: number): Promise<MultiControlType<Examples>> {
        /* istanbul ignore next */
        debug(
            "process(hasOnExamples: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.onExamples, e?.constructor.name, p?.constructor.name, i
        );
        let examples: MultiControlType<Examples> = e;
        if (this.preCompiler.onExamples) {
            const result = await this.preCompiler.onExamples(e, p, i);
            if (typeof result !== "undefined") {
                examples = result;
            }
        }
        if (examples) {
            if (Array.isArray(examples)) {
                debug("...Array: %d", examples.length);
                examples = await ExamplesProcessor.map(examples, this.postProcess.bind(this));
            } else {
                debug("...replace");
                examples = await this.postProcess(examples);
            }
        }
        return examples;
    }

    private async postProcess(e: Examples): Promise<Examples> {
        debug("postProcess(tags: %s, body: %s)", Array.isArray(e.tags), Array.isArray(e.body));
        e.tags = await this.tagsProcessor.execute(e.tags, e);
        e.header = (await this.tableRowProcessor.execute([e.header], e))?.[0];
        e.body = await this.tableRowProcessor.execute(e.body, e);
        return e;
    }
}