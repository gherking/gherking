import { DocString, Step } from "gherkin-ast";
import { DocStringProcessor } from "../src/DocStringProcessor";

describe("DocStringProcessor", () => {
    let step: Step;
    let docString: DocString;

    beforeEach(() => {
        docString = new DocString("content", "\"\"\"");
        step = new Step("Given", "step");
        step.docString = docString;
    });

    test("should handle if no pre/post-filter or event handler is set", async () => {
        const docStringProcessor = new DocStringProcessor();
        const result = await docStringProcessor.execute(docString, step);

        expect(result).toBe(docString);
    });

    test("should filter by pre-filter", async () => {
        const onDocString = jest.fn();
        const docStringProcessor = new DocStringProcessor({
            preDocString(e: DocString): boolean {
                return e.content !== "content";
            },
            onDocString,
        });
        const result = await docStringProcessor.execute(docString, step);

        expect(result).toBeNull();
        expect(onDocString).not.toHaveBeenCalled();
    });

    test("should filter by post-filter", async () => {
        const onDocString = jest.fn();
        const docStringProcessor = new DocStringProcessor({
            postDocString(e: DocString): boolean {
                return e.content !== "content";
            },
            onDocString,
        });
        const result = await docStringProcessor.execute(docString, step);

        expect(result).toBeNull();
        expect(onDocString).toHaveBeenCalledWith(docString, step);
    });

    test("should process with event handler", async () => {
        const docStringProcessor = new DocStringProcessor({
            onDocString(e: DocString): void {
                e.content += "2";
            },
        });
        const result = await docStringProcessor.execute(docString, step);

        expect(result).toBe(docString);
        expect(result.content).toBe("content2");
    });
});