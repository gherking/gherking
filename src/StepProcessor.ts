import { Background, Scenario, ScenarioOutline, Step } from "gherkin-ast";
import { DataTableProcessor } from "./DataTableProcessor";
import { getDebugger } from './debug';
import { DocStringProcessor } from "./DocStringProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { ListProcessor } from "./Processor";

const stepDebug = getDebugger("StepProcessor");

export class StepProcessor<P extends Background | Scenario | ScenarioOutline> extends ListProcessor<Step, P> {
    private docStringProcessor: DocStringProcessor;
    private dataTableProcessor: DataTableProcessor;

    constructor(preCompiler?: Partial<PreCompiler>) {
        stepDebug("constructor(%o)", preCompiler);
        super(preCompiler);
        this.docStringProcessor = new DocStringProcessor(preCompiler);
        this.dataTableProcessor = new DataTableProcessor(preCompiler);
    }

    protected preFilter(e: Step, p: P, i: number): boolean {
        stepDebug("preFilter(hasPreStep: %s, i: %d)", !!this?.preCompiler?.preStep, i);
        return !this?.preCompiler?.preStep || this.preCompiler.preStep(e, p, i);
    }
    protected postFilter(e: Step, p: P, i: number): boolean {
        stepDebug("postFilter(hasPostStep: %s, i: %d)", !!this?.preCompiler?.postStep, i);
        return !this?.preCompiler?.postStep || this.preCompiler.postStep(e, p, i);
    }
    protected process(e: Step, p: P, i: number): MultiControlType<Step> {
        stepDebug("process(hasOnStep: %s, i: %d)", !!this?.preCompiler?.onStep, i);
        let step: MultiControlType<Step> = e;
        if (this?.preCompiler?.onStep) {
            step = this.preCompiler.onStep(e, p, i);
        }
        if (step) {
            if (Array.isArray(step)) {
                stepDebug("...Array: %d", step.length);
                step = step.map(this.postProcess.bind(this));
            } else {
                stepDebug("...replace");
                step = this.postProcess(step);
            }
        }
        return step;
    }

    private postProcess(e: Step): Step {
        stepDebug("postProcess(docString: %s, dataTable: %s)", !!e?.docString, !!e?.dataTable);
        if (e?.docString) {
            stepDebug("...docString")
            e.docString = this.docStringProcessor.execute(e.docString, e);
        }
        if (e?.dataTable) {
            stepDebug("...dataTable")
            e.dataTable = this.dataTableProcessor.execute(e.dataTable, e);
        }
        return e;
    }
}
