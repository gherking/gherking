import {Document, Feature, Rule, Element } from "gherkin-ast";
import { ElementProcessor } from "./ElementProcessor";
import { MultiControlType, PreCompiler } from "./PreCompiler";
import { Processor } from "./Processor";
import { RuleProcessor } from "./RuleProcessor";
import { TagProcessor } from "./TagProcessor";


export class FeatureProcessor extends Processor<Feature, Document, MultiControlType<Feature>> {
    private tagProcessor: TagProcessor<Feature>;
    private ruleProcessor: RuleProcessor;
    private elementProcessor: ElementProcessor<Feature>

    constructor(preCompiler: Partial<PreCompiler>) {
        super(preCompiler);
        this.tagProcessor = new TagProcessor<Feature>(preCompiler);
        this.ruleProcessor = new RuleProcessor(preCompiler);
        this.elementProcessor = new ElementProcessor<Feature>(preCompiler);
    }

    protected preFilter(e: Feature, p: Document): boolean {
        return !this.preCompiler.preFeature || this.preCompiler.preFeature(e, p);
    }
    protected postFilter(e: Feature, p: Document): boolean {
        return !this.preCompiler.postFeature || this.preCompiler.postFeature(e, p);
    }
    protected process(e: Feature, p: Document): Feature[] {
        let features = [e];
        if (this.preCompiler.onFeature) {
            const result = this.preCompiler.onFeature(e, p);
            if (result === null) {
                return [];
            }
            if (Array.isArray(result)) {
                features = result;
            } else if (result) {
                features = [result];
            }
        }

        features.forEach((feature) => {
            feature.tags = this.tagProcessor.execute(feature.tags, feature);

            const elements = feature.elements;
            if (this.hasRule(elements)) {
                feature.elements = this.ruleProcessor.execute(elements, feature);
            } else {
                feature.elements = this.elementProcessor.execute(elements as Element[], feature)
            }
        });

        return features;
    }

    private hasRule(elements: (Element | Rule)[]): elements is Rule[] {
        return !!elements[0] && elements[0] instanceof Rule;
    }
}