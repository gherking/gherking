import { Document, Feature } from "gherkin-ast";
import { FeatureProcessor } from "./FeatureProcessor";
import { PreCompiler } from "./PreCompiler";
import { ProcessorBase } from "./Processor";
import { getDebugger } from "./debug";

const debug = getDebugger("DocumentProcessor");

export class DocumentProcessor extends ProcessorBase {
    private featureProcessor: FeatureProcessor;

    constructor(preCompiler?: Partial<PreCompiler>) {
        debug("constructor(%o)", preCompiler);
        super(preCompiler);
        this.featureProcessor = new FeatureProcessor(preCompiler);
    }

    public async execute(e: Document): Promise<Document[]> {
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
        const features: Feature[] = await this.featureProcessor.execute(document.feature, document) as Feature[];
        if (!features) {
            debug("...!features");
            return [];
        }

        debug("...Array %d", features.length);

        const newDocuments: Document[] = [];
        for (let i = 0; i < features.length; ++i) {
            const feature = features[i];

            debug("...map(i: %d)", i);
            const newDocument = e.clone();
            newDocument.feature = feature;
            if (!this.preCompiler.onDocument) {
                newDocuments.push(newDocument);
                continue;
            }

            const result = await this.preCompiler.onDocument(newDocument);
            debug("...onDocument(result: %s)", typeof result);
            newDocuments.push(result === null ? null : result || newDocument);
        }
        return newDocuments.filter(Boolean);
    }
}
