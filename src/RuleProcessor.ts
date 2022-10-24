import { Feature, Rule } from "gherkin-ast";
import { ElementProcessor } from "./ElementProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { ListProcessor } from "./Processor";
import { getDebugger } from "./debug";

const debug = getDebugger("RuleProcessor");

export class RuleProcessor extends ListProcessor<Rule, Feature> {
    private elementProcessor: ElementProcessor<Rule>;

    constructor(preCompiler?: Partial<PreCompiler>) {
        debug("constructor(%o)", preCompiler);
        super(preCompiler);
        this.elementProcessor = new ElementProcessor<Rule>(preCompiler);
    }

    protected async preFilter(e: Rule, p: Feature, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "preFilter(hasPreRule: %s, e: %s, p: %s, i: %d)",
            !!this.preCompiler.preRule, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.preRule || await this.preCompiler.preRule(e, p, i);
    }
    protected async postFilter(e: Rule, p: Feature, i: number): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "postFilter(hasPostRule: %s, e: %s, p: %s, i: %d)", 
            !!this.preCompiler.postRule, e?.constructor.name, p?.constructor.name, i
        );
        return !this.preCompiler.postRule || await this.preCompiler.postRule(e, p, i);
    }
    protected async process(e: Rule, p: Feature, i: number): Promise<MultiControlType<Rule>> {
        /* istanbul ignore next */
        debug(
            "process(hasOnRule: %s, e: %s, p: %s, i: %d)", 
            !!this.preCompiler.onRule, e?.constructor.name, p?.constructor.name, i
        );
        let rule: MultiControlType<Rule> = e;
        if (this.preCompiler.onRule) {
            const result = await this.preCompiler.onRule(e, p, i);
            if (typeof result !== "undefined") {
                rule = result;
            }
        }
        if (rule) {
            if (Array.isArray(rule)) {
                debug("...Array: %d", rule.length);
                rule = await RuleProcessor.map(rule, this.postProcess.bind(this));
            } else {
                debug("...replace");
                rule = await this.postProcess(rule);
            }
        }
        return rule;
    }

    private async postProcess(e: Rule): Promise<Rule> {
        debug("postProcess(elements: %s)", Array.isArray(e.elements));
        e.elements = await this.elementProcessor.execute(e.elements, e);
        return e;
    }
}