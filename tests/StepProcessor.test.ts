import { Background, Step, DocString, DataTable, TableRow, TableCell } from "gherkin-ast";
import { DocStringProcessor } from "../src/DocStringProcessor";
import { DataTableProcessor } from "../src/DataTableProcessor";
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

        steps[0].docString = new DocString("1");
        steps[1].docString = new DocString("2");
        steps[2].docString = new DocString("3");

        steps[0].dataTable = new DataTable([new TableRow([new TableCell("1")])]);
        steps[1].dataTable = new DataTable([new TableRow([new TableCell("2")])]);
        steps[2].dataTable = new DataTable([new TableRow([new TableCell("3")])]);

        background.steps = steps;
    })

    test("should handle if no pre/post-filter or event handler is set", () => {
        const stepProcessor = new StepProcessor<Background>();
        const results = stepProcessor.execute(steps, background);

        expect(results).toEqual(steps);
    });

    test("should filter by pre-filter", () => {
        const onStep = jest.fn();
        const stepProcessor = new StepProcessor<Background>({
            preStep(e: Step): boolean {
                return e.text === ""
            },
            onStep
        });
        const results = stepProcessor.execute(steps, background);

        expect(results).toEqual([]);
        expect(onStep).not.toHaveBeenCalled();
    });

    test("should filter by post-filter", () => {
        const onStep = jest.fn();
        const stepProcessor = new StepProcessor<Background>({
            postStep(e: Step): boolean {
                return e.text === ""
            },
            onStep
        });
        const results = stepProcessor.execute(steps, background);

        expect(results).toEqual([]);
        expect(onStep).not.toHaveBeenCalledWith(steps, background);
    });

    test("should process step with event handler", () => {

        const stepProcessor = new StepProcessor<Background>({
            onStep(e: Step): void {
                e.text += "1";
            },
        });
        const results = stepProcessor.execute(steps, background);

        expect(results).toBeInstanceOf(Array);
        expect(results[0].text).toEqual("11");
        expect(results[1].text).toEqual("21");
        expect(results[2].text).toEqual("31");
    });

    test("should process array of steps with event handler", () => {
        const stepProcessor = new StepProcessor<Background>({
            onStep(e: Step): Step[] {
                e.text += "1";
                return new Array(e);
            },
        });
        const results = stepProcessor.execute(steps, background);

        expect(results).toBeInstanceOf(Array);
        expect(results[0].text).toEqual("11");
        expect(results[1].text).toEqual("21");
        expect(results[2].text).toEqual("31");
    });

    test("should process docString of step", () => {
        const onDocString = jest.fn();
        const docStringProcessor = new DocStringProcessor({
            onDocString,
        })
        const stepProcessor = new StepProcessor<Background>({
            onStep(e: Step): void {
                docStringProcessor.execute(e.docString, e)
            },
        });

        const results = stepProcessor.execute(steps, background);
        expect(onDocString).toHaveBeenCalledWith(steps[0].docString, steps[0]);
        expect(onDocString).toHaveBeenCalledWith(steps[1].docString, steps[1]);
        expect(onDocString).toHaveBeenCalledWith(steps[2].docString, steps[2]);
        expect(results).not.toBeNull();
    });

    test("should process dataTable of step", () => {
        const onDataTable = jest.fn();
        const dataTableProcessor = new DataTableProcessor({
            onDataTable,
        })
        const stepProcessor = new StepProcessor<Background>({
            onStep(e: Step): void {
                dataTableProcessor.execute(e.dataTable, e)
            },
        });

        const results = stepProcessor.execute(steps, background);
        expect(onDataTable).toHaveBeenCalledWith(steps[0].dataTable, steps[0]);
        expect(onDataTable).toHaveBeenCalledWith(steps[1].dataTable, steps[1]);
        expect(onDataTable).toHaveBeenCalledWith(steps[2].dataTable, steps[2]);
        expect(results).not.toBeNull();
    });
})