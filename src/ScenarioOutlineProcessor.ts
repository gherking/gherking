import { Feature, Rule, ScenarioOutline } from "gherkin-ast";
import {ExamplesProcessor} from "./ExamplesProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { PartialListProcessor } from "./Processor";
import { StepProcessor } from "./StepProcessor";
import { TagProcessor } from "./TagProcessor";

export class ScenarioOutlineProcessor<P extends Feature | Rule> extends PartialListProcessor<ScenarioOutline, P> {
    private stepProcessor: StepProcessor<ScenarioOutline>;
    private tagProcessor: TagProcessor<ScenarioOutline>;
    private examplesProcessor: ExamplesProcessor;

    constructor(preCompiler: Partial<PreCompiler>) {
        super(preCompiler);
        this.stepProcessor = new StepProcessor<ScenarioOutline>(preCompiler);
        this.tagProcessor = new TagProcessor<ScenarioOutline>(preCompiler);
        this.examplesProcessor = new ExamplesProcessor(preCompiler);
    }

    public preFilter(e: ScenarioOutline, p: P, i: number): boolean {
        return !this.preCompiler.preScenarioOutline || this.preCompiler.preScenarioOutline(e, p, i);
    }
    public postFilter(e: ScenarioOutline, p: P, i: number): boolean {
        return !this.preCompiler.postScenarioOutline || this.preCompiler.postScenarioOutline(e, p, i);
    }
    public process(e: ScenarioOutline, p: P, i: number): MultiControlType<ScenarioOutline> {
        let scenarioOutlines: MultiControlType<ScenarioOutline> = e;
        if (this.preCompiler.onScenarioOutline) {
            scenarioOutlines = this.preCompiler.onScenarioOutline(e, p, i);
        }
        if (scenarioOutlines) {
            if (Array.isArray(scenarioOutlines)) {
                scenarioOutlines = scenarioOutlines.map(this.postProcess.bind(this));
            } else {
                scenarioOutlines = this.postProcess(scenarioOutlines);
            }
        }
        return scenarioOutlines;
    }

    private postProcess(e: ScenarioOutline): ScenarioOutline {
        e.tags = this.tagProcessor.execute(e.tags, e);
        e.steps = this.stepProcessor.execute(e.steps, e);
        e.examples = this.examplesProcessor.execute(e.examples, e);
        return e;
    }
}