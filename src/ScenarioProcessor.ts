import { Feature, Rule, Scenario } from "gherkin-ast";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { PartialListProcessor } from "./Processor";
import { StepProcessor } from "./StepProcessor";
import { TagProcessor } from "./TagProcessor";

export class ScenarioProcessor<P extends Feature | Rule> extends PartialListProcessor<Scenario, P> {
    private stepProcessor: StepProcessor<Scenario>;
    private tagProcessor: TagProcessor<Scenario>;

    constructor(preCompiler?: Partial<PreCompiler>) {
        super(preCompiler);
        this.stepProcessor = new StepProcessor<Scenario>(preCompiler);
        this.tagProcessor = new TagProcessor<Scenario>(preCompiler);
    }

    public preFilter(e: Scenario, p: P, i: number): boolean {
        return !this?.preCompiler?.preScenario || this?.preCompiler?.preScenario(e, p, i);
    }
    public postFilter(e: Scenario, p: P, i: number): boolean {
        return !this?.preCompiler?.postScenario || this?.preCompiler?.postScenario(e, p, i);
    }
    public process(e: Scenario, p: P, i: number): MultiControlType<Scenario> {
        let scenario: MultiControlType<Scenario> = e;
        if (this?.preCompiler?.onScenario) {
            scenario = this.preCompiler.onScenario(e, p, i);
        }
        if (scenario) {
            if (Array.isArray(scenario)) {
                scenario = scenario.map(this.postProcess.bind(this));
            } else {
                scenario = this.postProcess(scenario);
            }
        }
        return scenario;
    }

    private postProcess(e: Scenario): Scenario {
        e.tags = this.tagProcessor.execute(e.tags, e);
        e.steps = this.stepProcessor.execute(e.steps, e);
        return e;
    }
}