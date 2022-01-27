import { Feature, Document, pruneID } from "gherkin-ast";
import { DocumentProcessor } from "../src/DocumentProcessor";

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
        expect(pruneID(result2)).toEqual([pruneID(document2)]);
    });

    test("should handle when processing returns null", () => {
        const postFeature = jest.fn()
        const documentProcessor = new DocumentProcessor({
            onFeature() {
                return null;
            },
            postFeature,
        });
        const result = documentProcessor.execute(document2)
        expect(result).toEqual([])
    });

    test("should handle null document", () => {
        const documentProcessor = new DocumentProcessor();

        const result = documentProcessor.execute(null);

        expect(result).toEqual([]);
    });

})