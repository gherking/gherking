import { Feature, Document } from "gherkin-ast";
import { DocumentProcessor } from "../src/DocumentProcessor";

describe("DocumentProcessor", () => {
    // let document1: Document;
    let document2: Document;
    let feature: Feature;

    beforeEach(() => {
        feature = new Feature("k", "n", "d");
        // document1 = new Document("1");
        document2 = new Document("2", feature);
    })

    test("should work if no pre/post-filter or event handler is set", () => {
        const documentProcessor = new DocumentProcessor();
        // const result1 = documentProcessor.execute(document1);
        const result2 = documentProcessor.execute(document2);
        // expect(result1).toEqual([document1]);
        expect(result2).toEqual([document2]);
    });
})