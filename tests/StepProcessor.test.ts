import { Background, Step } from "gherkin-ast";
import { StepProcessor } from "../src/StepProcessor";

describe("StepProcessor", () => {
    let background: Background;
    let steps: Step[];

    beforeEach(() => {
        steps = [
            new Step("Given", "1"),
            new Step("When", "2"),
            new Step("Then", "3"),
        ];
        background = new Background("Background", "0", "");
        background.steps = steps;
    })

    test("should handle if no pre/post-filter or event handler is set", () => {
        const stepProcessor = new StepProcessor<Background>();
        const results = stepProcessor.execute(steps, background);

        expect(results).toEqual(steps);
    });

    test.todo("should filter by pre-filter");

    test.todo("should filter by post-filter");

    test.todo("should process step with event handler");

    test.todo("should process docString of step");

    test.todo("should process dataTable of steo");
})