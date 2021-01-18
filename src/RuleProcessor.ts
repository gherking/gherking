import { Feature, Rule } from "gherkin-ast";
import { ElementProcessor } from "./ElementProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { ListProcessor } from "./Processor";

export class RuleProcessor extends ListProcessor<Rule, Feature> {
    private elementProcessor: ElementProcessor<Rule>;

    constructor(preCompiler: Partial<PreCompiler>) {
        super(preCompiler);
        this.elementProcessor = new ElementProcessor<Rule>(preCompiler);
    }

    protected preFilter(e: Rule, p: Feature, i: number): boolean {
        return !this.preCompiler.preRule || this.preCompiler.preRule(e, p, i);
    }
    protected postFilter(e: Rule, p: Feature, i: number): boolean {
        return !this.preCompiler.postRule || this.preCompiler.postRule(e, p, i);
    }
    protected process(e: Rule, p: Feature, i: number): MultiControlType<Rule> {
        let rule: MultiControlType<Rule> = e;
        if (this.preCompiler.onRule) {
            rule = this.preCompiler.onRule(e, p, i);
        }
        if (rule) {
            if (Array.isArray(rule)) {
                rule[0] = this.postProcess(rule[0]);
            } else {
                rule = this.postProcess(rule);
            }
        }
        return rule;
    }
    
    private postProcess(e: Rule): Rule {
        e.elements = this.elementProcessor.execute(e.elements, e);
        return e;
    }
}