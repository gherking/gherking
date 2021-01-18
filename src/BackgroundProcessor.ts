import { Background, Feature, Rule } from "gherkin-ast";
import { PreCompiler } from "./PreCompiler";
import { PartialProcessor } from "./Processor";
import { StepProcessor } from "./StepProcessor";

export class BackgroundProcessor<P extends Feature | Rule> extends PartialProcessor<Background, P> {
    private stepProcessor: StepProcessor<Background>;

    constructor(preCompiler: Partial<PreCompiler>) {
        super(preCompiler);
        this.stepProcessor = new StepProcessor(preCompiler);
    }

    public preFilter(e: Background, p: P): boolean {
        return !this.preCompiler.preBackground || this.preCompiler.preBackground(e, p);
    }
    public postFilter(e: Background, p: P): boolean {
        return !this.preCompiler.postBackground || this.preCompiler.postBackground(e, p);
    }
    public process(e: Background, p: P): Background {
        let background = e;
        if (this.preCompiler.onBackground) {
            background = this.preCompiler.onBackground(e, p);
        }
        if (background) {
            background.steps = this.stepProcessor.execute(background.steps, background);
        }
        return background;
    }
}