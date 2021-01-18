import { DocString, Step } from "gherkin-ast";
import { Processor } from "./Processor";

export class DocStringProcessor extends Processor<DocString, Step> {
    protected preFilter(e: DocString, p: Step): boolean {
        return !this.preCompiler.preDocString || this.preCompiler.preDocString(e, p);
    }
    protected postFilter(e: DocString, p: Step): boolean {
        return !this.preCompiler.postDocString || this.preCompiler.postDocString(e, p);
    }
    protected process(e: DocString, p: Step): DocString {
        if (this.preCompiler.onDocString) {
            return this.preCompiler.onDocString(e, p);
        }
    }
}