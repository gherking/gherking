import { Examples, Feature, Scenario, ScenarioOutline, Tag } from "gherkin-ast";
import { getDebugger } from './debug';
import { MultiControlType } from "./PreCompiler";
import { ListProcessor } from "./Processor";

const tagDebug = getDebugger("TagProcessor");

export class TagProcessor<P extends Feature | Scenario | ScenarioOutline | Examples> extends ListProcessor<Tag, P> {
    protected preFilter(e: Tag, p: P, i: number): boolean {
        tagDebug("preFilter(hasPreTag: %s, i: %d)", !!this.preCompiler.preTag, i);
        return !this.preCompiler.preTag || this.preCompiler.preTag(e, p, i);
    }
    protected postFilter(e: Tag, p: P, i: number): boolean {
        tagDebug("postFilter(hasPostTag: %s, i: %d)", !!this.preCompiler.postTag, i);
        return !this.preCompiler.postTag || this.preCompiler.postTag(e, p, i);
    }
    protected process(e: Tag, p: P, i: number): MultiControlType<Tag> {
        tagDebug("process(hasOnTag: %s, i: %d)", !!this.preCompiler.onTag, i);
        if (this.preCompiler.onTag) {
            return this.preCompiler.onTag(e, p, i);
        }
    }
}