import { DocString, Step } from "gherkin-ast";
import { SingleControlType } from "./PreCompiler";
import { Processor } from "./Processor";
import { getDebugger } from "./debug";

const debug = getDebugger("DocStringProcessor");

export class DocStringProcessor extends Processor<DocString, Step> {
    protected async preFilter(e: DocString, p: Step): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "preFilter(hasPreDocString: %s, e: %s, p: %s)",
            !!this.preCompiler.preDocString, e?.constructor.name, p?.constructor.name
        );
        return !this.preCompiler.preDocString || await this.preCompiler.preDocString(e, p);
    }
    protected async postFilter(e: DocString, p: Step): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "postFilter(hasPostDocString: %s, e: %s, p: %s)",
            !!this.preCompiler.postDocString, e?.constructor.name, p?.constructor.name
        );
        return !this.preCompiler.postDocString || await this.preCompiler.postDocString(e, p);
    }
    protected async process(e: DocString, p: Step): Promise<SingleControlType<DocString>> {
        /* istanbul ignore next */
        debug(
            "process(hasOnDocString: %s, e: %s, p: %s)",
            !!this.preCompiler.onDocString, e?.constructor.name, p?.constructor.name
        );
        if (this.preCompiler.onDocString) {
            return this.preCompiler.onDocString(e, p);
        }
    }
}