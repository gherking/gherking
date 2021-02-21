import { getDebugger } from './debug';
import { Background, Feature, Rule, Scenario, Element, ScenarioOutline } from "gherkin-ast";
import { BackgroundProcessor } from "./BackgroundProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { ListProcessor } from "./Processor";
import { ScenarioProcessor } from "./ScenarioProcessor";
import { ScenarioOutlineProcessor } from './ScenarioOutlineProcessor';

const elementDebug = getDebugger("ElementProcessor");

export class ElementProcessor<P extends Feature | Rule> extends ListProcessor<Element, P> {
    private backgroundProcessor: BackgroundProcessor<P>;
    private scenarioProcessor: ScenarioProcessor<P>;
    private scenarioOutlineProcessor: ScenarioOutlineProcessor<P>;

    constructor(preCompiler?: Partial<PreCompiler>) {
        super(preCompiler);
        this.backgroundProcessor = new BackgroundProcessor<P>(preCompiler);
        this.scenarioProcessor = new ScenarioProcessor<P>(preCompiler);
        this.scenarioOutlineProcessor = new ScenarioOutlineProcessor<P>(preCompiler);
    }

    protected preFilter(e: Element, p: P, i: number): boolean {
        elementDebug("preFilter(constructor: %s, i: %d)", e.constructor.name, i);
        if (e instanceof Background) {
            elementDebug("preFilter -> Background");
            return this.backgroundProcessor.preFilter(e, p);
        }
        if (e instanceof Scenario) {
            elementDebug("preFilter -> Scenario");
            return this.scenarioProcessor.preFilter(e, p, i);
        }
        if (e instanceof ScenarioOutline) {
            elementDebug("preFilter -> ScenarioOutline");
            return this.scenarioOutlineProcessor.preFilter(e, p, i);
        }
    }
    protected postFilter(e: Element, p: P, i: number): boolean {
        elementDebug("postFilter(constructor: %s, i: %d)", e.constructor.name, i);
        if (e instanceof Background) {
            elementDebug("postFilter -> Background");
            return this.backgroundProcessor.preFilter(e, p);
        }
        if (e instanceof Scenario) {
            elementDebug("postFilter -> Scenario");
            return this.scenarioProcessor.postFilter(e, p, i);
        }
        if (e instanceof ScenarioOutline) {
            elementDebug("postFilter -> ScenarioOutline");
            return this.scenarioOutlineProcessor.postFilter(e, p, i);
        }
    }
    protected process(e: Element, p: P, i: number): MultiControlType<Element> {
        elementDebug("process(constructor: %s, i: %d)", e.constructor.name, i);
        if (e instanceof Background) {
            elementDebug("process -> Background");
            return this.backgroundProcessor.process(e, p);
        }
        if (e instanceof Scenario) {
            elementDebug("process -> Scenario");
            return this.scenarioProcessor.process(e, p, i);
        }
        if (e instanceof ScenarioOutline) {
            elementDebug("process -> ScenarioOutline");
            return this.scenarioOutlineProcessor.process(e, p, i);
        }
    }
}