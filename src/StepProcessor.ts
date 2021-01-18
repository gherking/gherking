import { Background, Scenario, ScenarioOutline, Step } from "gherkin-ast";
import { DataTableProcessor } from "./DataTableProcessor";
import { DocStringProcessor } from "./DocStringProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { ListProcessor } from "./Processor";

export class StepProcessor<P extends Background | Scenario | ScenarioOutline> extends ListProcessor<Step, P> {
    private docStringProcessor: DocStringProcessor;
    private dataTableProcessor: DataTableProcessor;
    
    constructor(preCompiler: Partial<PreCompiler>) {
        super(preCompiler);
        this.docStringProcessor = new DocStringProcessor(preCompiler);
        this.dataTableProcessor = new DataTableProcessor(preCompiler);
    }

    protected preFilter(e: Step, p: P, i: number): boolean {
        return !this.preCompiler.preStep || this.preCompiler.preStep(e, p, i);
    }
    protected postFilter(e: Step, p: P, i: number): boolean {
        return !this.preCompiler.postStep || this.preCompiler.postStep(e, p, i);
    }
    protected process(e: Step, p: P, i: number): MultiControlType<Step> {
        let step: MultiControlType<Step> = e;
        if (this.preCompiler.onStep) {
            step = this.preCompiler.onStep(e, p, i);
        }
        if (step) {
            if (Array.isArray(step)) {
                step[0] = this.postProcess(step[0]);
            } else {
                step = this.postProcess(step);
            }
        }
        return step;
    }

    private postProcess(e: Step): Step {
        if (e.docString) {
            e.docString = this.docStringProcessor.execute(e.docString, e);
        }
        if (e.dataTable) {
            e.dataTable = this.dataTableProcessor.execute(e.dataTable, e);
        }
        return e;
    }
}
