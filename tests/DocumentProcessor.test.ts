import { Feature, Document } from "gherkin-ast";
import { DocumentProcessor } from "../src/DocumentProcessor";
import { SingleControlType } from "../src/PreCompiler";
import { Processor } from "../src/Processor";

describe("DocumentProcessor", () => {
    let document1: Document;
    let document2: Document;
    let feature: Feature;

    beforeEach(() => {
        feature = new Feature("k", "n", "d");
        document1 = new Document("1");
        document2 = new Document("2", feature);
    });

    test("should work if no pre/post-filter or event handler is set", () => {
        const documentProcessor = new DocumentProcessor();
        const result1 = documentProcessor.execute(document1);
        const result2 = documentProcessor.execute(document2);
        expect(result1).toEqual([]);
        expect(result2).toEqual([document2]);
    });

    test("should handle ", () => {
        const postFeature = jest.fn()
        const documentProcessor = new DocumentProcessor({
            onFeature() {
                return null;
            },
            postFeature
        });
        const result = documentProcessor.execute(document2)
        expect(result).toEqual([])
    });

    test("should handle null document", () => {
        const documentProcessor = new DocumentProcessor();

        const result = documentProcessor.execute(null);

        expect(result).toEqual([]);
    });

    test("should handle when feature processor retuns singular feature", () => {
        class SingleFeatureProcessor extends Processor<Feature, Document, SingleControlType<Feature>> {
            protected preFilter(_e: Feature, _p: Document): boolean {
                return true;
            }
            protected postFilter(_e: Feature, _p: Document): boolean {
                return true
            }
            public process(e: Feature, _p: Document): SingleControlType<Feature> {
                return e;
            }

        }
        const singleFeatureProcessor = new SingleFeatureProcessor()
        const documentProcessor = new DocumentProcessor({
            preFeature(_e) {
                return true;
            },
            onFeature(f: Feature) {
                return singleFeatureProcessor.process(f, null);
            },
            postFeature(_e) {
                return true
            }
        });

        const result = documentProcessor.execute(document1);

        expect(result).toBe([document1]);
    });
})