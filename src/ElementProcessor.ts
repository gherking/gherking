import { Background, Feature, Rule, Scenario, Element, ScenarioOutline } from "gherkin-ast";
import { BackgroundProcessor } from "./BackgroundProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { ListProcessor } from "./Processor";
import { ScenarioProcessor } from "./ScenarioProcessor";

export class ElementProcessor<P extends Feature | Rule> extends ListProcessor<Element, P> {
    private backgroundProcessor: BackgroundProcessor<P>;
    private scenarioProcessor: ScenarioProcessor<P>;

    constructor(preCompiler: Partial<PreCompiler>) {
        super(preCompiler);
        this.backgroundProcessor = new BackgroundProcessor<P>(preCompiler);
        this.scenarioProcessor = new ScenarioProcessor<P>(preCompiler);
    }

    protected preFilter(e: Element, p: P, i: number): boolean {
        if (e instanceof Background) {
            return this.backgroundProcessor.preFilter(e, p);
        }
        if (e instanceof Scenario) {
            return this.scenarioProcessor.preFilter(e, p, i);
        }
    }
    protected postFilter(e: Element, p: P, i: number): boolean {
        if (e instanceof Background) {
            return this.backgroundProcessor.preFilter(e, p);
        }
        if (e instanceof Scenario) {
            return this.scenarioProcessor.postFilter(e, p, i);
        }
    }
    protected process(e: Element, p: P, i: number): MultiControlType<Element> {
        if (e instanceof Background) {
            return this.backgroundProcessor.process(e, p);
        }
        if (e instanceof Scenario) {
            return this.scenarioProcessor.process(e, p, i);
        }
    }
}