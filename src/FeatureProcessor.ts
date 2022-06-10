import { Document, Feature, Rule, Element } from "gherkin-ast";
import { ElementProcessor } from "./ElementProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { Processor } from "./Processor";
import { RuleProcessor } from "./RuleProcessor";
import { TagProcessor } from "./TagProcessor";
import { getDebugger } from "./debug";

const debug = getDebugger("FeatureProcessor");

export class FeatureProcessor extends Processor<Feature, Document, MultiControlType<Feature>> {
    private tagProcessor: TagProcessor<Feature>;
    private ruleProcessor: RuleProcessor;
    private elementProcessor: ElementProcessor<Feature>

    constructor(preCompiler?: Partial<PreCompiler>) {
        debug("constructor(%o)", preCompiler);
        super(preCompiler);
        this.tagProcessor = new TagProcessor<Feature>(preCompiler);
        this.ruleProcessor = new RuleProcessor(preCompiler);
        this.elementProcessor = new ElementProcessor<Feature>(preCompiler);
    }

    protected async preFilter(e: Feature, p: Document): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "preFilter(hasPreFeature: %s, e: %s, p: %s)",
            !!this.preCompiler.preFeature, e?.constructor.name, p?.constructor.name
        );
        return !this.preCompiler.preFeature || await this.preCompiler.preFeature(e, p);
    }
    protected async postFilter(e: Feature, p: Document): Promise<boolean> {
        /* istanbul ignore next */
        debug(
            "postFilter(hasPreFeature: %s, e: %s, p: %s)",
            !!this.preCompiler.postFeature, e?.constructor.name, p?.constructor.name
        );
        return !this.preCompiler.postFeature || await this.preCompiler.postFeature(e, p);
    }
    protected async process(e: Feature, p: Document): Promise<Feature[]> {
        /* istanbul ignore next */
        debug(
            "process(hasOnFeature: %s, e: %s, p: %s)",
            !!this.preCompiler.onFeature, e?.constructor.name, p?.constructor.name
        );

        let features = [e];
        if (this.preCompiler.onFeature) {
            const result = await this.preCompiler.onFeature(e, p);
            if (result === null) {
                debug("...delete");
                return [];
            }
            if (Array.isArray(result)) {
                debug("...Array: %d", result.length);
                features = result;
            } else if (result) {
                debug("...replace");
                features = [result];
            }
        }

        for (let i = 0; i < features.length; ++i) {
            const feature = features[i];

            debug("...forEach %d", i);
            feature.tags = await this.tagProcessor.execute(feature?.tags, feature);

            const elements = feature.elements;
            if (this.hasRule(elements)) {
                debug("......hasRule %d", i);
                feature.elements = await this.ruleProcessor.execute(elements, feature);
            } else {
                debug("......noRule %d", i);
                feature.elements = await this.elementProcessor.execute(elements as Element[], feature)
            }
        }

        return features;

    }

    private hasRule(elements: (Element | Rule)[]): elements is Rule[] {
        return !!elements[0] && elements[0] instanceof Rule;
    }
}