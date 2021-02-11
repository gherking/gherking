import { Step, Tag, Scenario, Feature } from "gherkin-ast";
import { PreCompiler } from "../src/PreCompiler";
import { ScenarioProcessor } from "../src/ScenarioProcessor";

describe("ScenarioProcessor", () => {
    let scenario: Scenario;
    let feature: Feature;
    let steps: Step[];
    let tags: Tag[];
    let preCompiler: PreCompiler; 

    beforeEach(() => {
        steps = [
            new Step("Given", "1"),
            new Step("When", "2"),
            new Step("Then", "3"),
        ];
        tags = [
            new Tag("tag", "1"),
            new Tag("tag", "2"),
            new Tag("tag", "3"),
        ];

        scenario = new Scenario("1", "2", "3");
        feature = new Feature("1", "2", "3");

        scenario.steps = steps;
        scenario.tags = tags;
        feature.elements.push(scenario);

    })

    test("should handle if no pre/post-filter or event handler is set", () => {
        const scenarioProcessor = new ScenarioProcessor<Feature>(null);
        const results = scenarioProcessor.process(scenario, feature, 1);
        expect(results).toEqual(scenario);
    });

    test("should filter by pre-filter", () => {
        const onScenario = jest.fn();
        const scenarioProcessor = new ScenarioProcessor<Feature>({
            preScenario(e: Scenario): boolean {
                return e.steps[0].text !== ""
            },
            onScenario
        });
        const results = scenarioProcessor.process(scenario, feature, 1);

        expect(results).toEqual({});
        expect(onScenario).not.toHaveBeenCalled();
    });
    
})