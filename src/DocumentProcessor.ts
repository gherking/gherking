import { Document } from "gherkin-ast";
import { FeatureProcessor } from "./FeatureProcessor";
import { PreCompiler } from "./PreCompiler";
import { ProcessorBase } from "./Processor";

export class DocumentProcessor extends ProcessorBase {
    private featureProcessor: FeatureProcessor;

    constructor(preCompiler?: Partial<PreCompiler>) {
        super(preCompiler);
        this.featureProcessor = new FeatureProcessor(preCompiler);
    }

    public execute(e: Document): Document[] {
        const document = e.clone();
        let features = this.featureProcessor.execute(document.feature, document);
        if (!features) {
            return [];
        }
        if (!Array.isArray(features)) {
            features = [features];
        }
        return features.map((feature) => {
            const newDocument = e.clone();
            newDocument.feature = feature;
            return newDocument;
        });
    }
}
