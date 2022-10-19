import { Feature, Rule, ScenarioOutline, Scenario } from "gherkin-ast";
import { ExamplesProcessor } from "./ExamplesProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { PartialListProcessor } from "./Processor";
import { StepProcessor } from "./StepProcessor";
import { TagProcessor } from "./TagProcessor";
import { getDebugger } from "./debug";

const debug = getDebugger("ScenarioOutlineProcessor");

export class ScenarioOutlineProcessor<P extends Feature | Rule> extends PartialListProcessor<ScenarioOutline, P, Scenario | ScenarioOutline> {
    private stepProcessor: StepProcessor<Scenario | ScenarioOutline>;
    private tagProcessor: TagProcessor<Scenario | ScenarioOutline>;
    private examplesProcessor: ExamplesProcessor;

    constructor(preCompiler?: Partial<PreCompiler>) {
        debug("constructor(%o)", preCompiler);
        super(preCompiler);
        this.stepProcessor = new StepProcessor<ScenarioOutline>(preCompiler);
        this.tagProcessor = new TagProcessor<ScenarioOutline>(preCompiler);
        this.examplesProcessor = new ExamplesProcessor(preCompiler);
    }

    public async preFilter(e: ScenarioOutline, p: P, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "preFilter(hasPreScenarioOutline: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.preScenarioOutline, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.preScenarioOutline || await this.preCompiler.preScenarioOutline(e, p, i);
    }
    public async postFilter(e: ScenarioOutline, p: P, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "postFilter(hasPostScenarioOutline: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.postScenarioOutline, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.postScenarioOutline || await this.preCompiler.postScenarioOutline(e, p, i);
    }
    public async process(e: ScenarioOutline, p: P, i: number): Promise<MultiControlType<Scenario | ScenarioOutline>> {
        /* istanbul ignore next */
        debug(
            "process(hasOnScenarioOutline: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.onScenarioOutline, e?.constructor.name, p?.constructor.name, i
        );
        let scenarioOutlines: MultiControlType<Scenario | ScenarioOutline> = e;
        if (this.preCompiler.onScenarioOutline) {
            const result = await this.preCompiler.onScenarioOutline(e, p, i);
            if (typeof result !== "undefined") {
                scenarioOutlines = result;
            }
        }
        if (scenarioOutlines) {
            if (Array.isArray(scenarioOutlines)) {
                debug("...Array: %d", scenarioOutlines.length);
                scenarioOutlines = await ScenarioOutlineProcessor.map(scenarioOutlines, this.postProcess.bind(this));
            } else {
                debug("...replace");
                scenarioOutlines = await this.postProcess(scenarioOutlines);
            }
        }
        return scenarioOutlines;
    }

    private async postProcess(e: Scenario | ScenarioOutline): Promise<Scenario | ScenarioOutline> {
        debug(
            "postProcess(tags: %s, steps: %s, examples: %s)",
            // @ts-ignore
            Array.isArray(e.tags), Array.isArray(e.steps), Array.isArray(e?.examples),
        );
        e.tags = await this.tagProcessor.execute(e.tags, e);
        e.steps = await this.stepProcessor.execute(e.steps, e);
        if (e instanceof ScenarioOutline && e.examples) {
            e.examples = await this.examplesProcessor.execute(e.examples, e);
        }
        return e;
    }
}