import { Examples, Feature, Scenario, ScenarioOutline, Tag } from "gherkin-ast";
import { MultiControlType } from "./PreCompiler";
import { ListProcessor } from "./Processor";

export class TagProcessor<P extends Feature | Scenario | ScenarioOutline | Examples> extends ListProcessor<Tag, P> {
    protected preFilter(e: Tag, p: P, i: number): boolean {
        return !this.preCompiler.preTag || this.preCompiler.preTag(e, p, i);
    }
    protected postFilter(e: Tag, p: P, i: number): boolean {
        return !this.preCompiler.postTag || this.preCompiler.postTag(e, p, i);
    }
    protected process(e: Tag, p: P, i: number): MultiControlType<Tag> {
        if (this.preCompiler.onTag) {
            return this.preCompiler.onTag(e, p, i);
        }
    }
}