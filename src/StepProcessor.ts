import { Background, Scenario, ScenarioOutline, Step } from "gherkin-ast";
import { DataTableProcessor } from "./DataTableProcessor";
import { getDebugger } from "./debug";
import { DocStringProcessor } from "./DocStringProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { ListProcessor } from "./Processor";

const debug = getDebugger("StepProcessor");

export class StepProcessor<P extends Background | Scenario | ScenarioOutline> extends ListProcessor<Step, P> {
    private docStringProcessor: DocStringProcessor;
    private dataTableProcessor: DataTableProcessor;

    constructor(preCompiler?: Partial<PreCompiler>) {
        debug("constructor(%o)", preCompiler);
        super(preCompiler);
        this.docStringProcessor = new DocStringProcessor(preCompiler);
        this.dataTableProcessor = new DataTableProcessor(preCompiler);
    }

    protected async preFilter(e: Step, p: P, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "preFilter(hasPreStep: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.preStep, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.preStep || await this.preCompiler.preStep(e, p, i);
    }
    protected async postFilter(e: Step, p: P, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "postFilter(hasPostStep: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.postStep, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.postStep || await this.preCompiler.postStep(e, p, i);
    }
    protected async process(e: Step, p: P, i: number): Promise<MultiControlType<Step>> {
        /* istanbul ignore next */
        debug(
            "process(hasOnStep: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.onStep, e?.constructor.name, p?.constructor.name, i
        );
        let step: MultiControlType<Step> = e;
        if (this.preCompiler.onStep) {
            const result = await this.preCompiler.onStep(e, p, i);
            if (typeof result !== "undefined") {
                step = result;
            }
        }
        if (step) {
            if (Array.isArray(step)) {
                debug("...Array: %d", step.length);
                step = await StepProcessor.map(step, this.postProcess.bind(this));
            } else {
                debug("...replace");
                step = await this.postProcess(step);
            }
        }
        return step;
    }

    private async postProcess(e: Step): Promise<Step> {
        debug("postProcess(docString: %s, dataTable: %s)", !!e.docString, !!e.dataTable);
        if (e.docString) {
            debug("...docString")
            e.docString = await this.docStringProcessor.execute(e.docString, e);
        }
        if (e.dataTable) {
            debug("...dataTable")
            e.dataTable = await this.dataTableProcessor.execute(e.dataTable, e);
        }
        return e;
    }
}
