import { Document } from "gherkin-ast";
import { FeatureProcessor } from "./FeatureProcessor";
import { PreCompiler } from "./PreCompiler";
import { ProcessorBase } from "./Processor";
import { getDebugger } from './debug';

const debug = getDebugger("DocumentProcessor");

export class DocumentProcessor extends ProcessorBase {
    private featureProcessor: FeatureProcessor;

    constructor(preCompiler?: Partial<PreCompiler>) {
        debug("constructor(%o)", preCompiler);
        super(preCompiler);
        this.featureProcessor = new FeatureProcessor(preCompiler);
    }

    public execute(e: Document): Document[] {
        /* istanbul ignore next */
        debug("execute(e: %s)", e?.constructor.name);
        if (!e) {
            return [];
        }
        const document = e.clone();
        if (!document.feature) {
            debug("...!feature");
            return [];
        }
        let features = this.featureProcessor.execute(document.feature, document);
        if (!features) {
            debug("...!features");
            return [];
        }
        if (!Array.isArray(features)) {
            debug("...single feature");
            features = [features];
        } else {
            debug("...Array %d", features.length);
        }
        return features.map((feature, i) => {
            debug("...map(i: %d)", i);
            const newDocument = e.clone();
            newDocument.feature = feature;
            return newDocument;
        });
    }
}
