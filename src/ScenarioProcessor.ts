import { Feature, Rule, Scenario } from "gherkin-ast";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { PartialListProcessor } from "./Processor";
import { StepProcessor } from "./StepProcessor";
import { TagProcessor } from "./TagProcessor";
import { getDebugger } from "./debug";

const debug = getDebugger("ScenarioProcessor");

export class ScenarioProcessor<P extends Feature | Rule> extends PartialListProcessor<Scenario, P> {
    private stepProcessor: StepProcessor<Scenario>;
    private tagProcessor: TagProcessor<Scenario>;

    constructor(preCompiler?: Partial<PreCompiler>) {
        debug("constructor(%o)", preCompiler);
        super(preCompiler);
        this.stepProcessor = new StepProcessor<Scenario>(preCompiler);
        this.tagProcessor = new TagProcessor<Scenario>(preCompiler);
    }

    public async preFilter(e: Scenario, p: P, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "preFilter(hasPreScenario: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.preScenario, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.preScenario || await this.preCompiler.preScenario(e, p, i);
    }
    public async postFilter(e: Scenario, p: P, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "postFilter(hasPostScenario: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.postScenario, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.postScenario || await this.preCompiler.postScenario(e, p, i);
    }
    public async process(e: Scenario, p: P, i: number): Promise<MultiControlType<Scenario>> {
        /* istanbul ignore next */
        debug(
            "process(hasOnScenario: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.onScenario, e?.constructor.name, p?.constructor.name, i
        );
        let scenario: MultiControlType<Scenario> = e;
        if (this.preCompiler.onScenario) {
            const result = await this.preCompiler.onScenario(e, p, i);
            if (typeof result !== "undefined") {
                scenario = result;
            }
        }
        if (scenario) {
            if (Array.isArray(scenario)) {
                debug("...Array: %d", scenario.length);
                scenario = await ScenarioProcessor.map(scenario, this.postProcess.bind(this));
            } else {
                debug("...replace");
                scenario = await this.postProcess(scenario);
            }
        }
        return scenario;
    }

    private async postProcess(e: Scenario): Promise<Scenario> {
        debug("postProcess(tags: %s, steps: %s)", Array.isArray(e.tags), Array.isArray(e.steps));
        e.tags = await this.tagProcessor.execute(e.tags, e);
        e.steps = await this.stepProcessor.execute(e.steps, e);
        return e;
    }
}