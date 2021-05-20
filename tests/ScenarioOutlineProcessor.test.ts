import { Step, Tag, ScenarioOutline, Feature, Examples } from "gherkin-ast";
import { ScenarioOutlineProcessor } from "../src/ScenarioOutlineProcessor";

describe("ScenarioOutlineProcessor", () => {
    let scenarioOutline1: ScenarioOutline, scenarioOutline2: ScenarioOutline;
    let feature: Feature;
    let steps: Step[];
    let tags: Tag[];
    let examples: Examples[];

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
        examples = [
            new Examples("1", "e"),
            new Examples("2", "f"),
            new Examples("3", "g"),
        ]

        scenarioOutline1 = new ScenarioOutline("1", "2", "3");
        scenarioOutline2 = new ScenarioOutline("4", "5", "6");
        feature = new Feature("1", "2", "3");

        scenarioOutline1.steps = steps;
        scenarioOutline2.steps = steps;
        scenarioOutline1.tags = tags;
        scenarioOutline2.tags = tags;
        scenarioOutline1.examples = undefined;
        scenarioOutline2.examples = examples;
        feature.elements.push(scenarioOutline1, scenarioOutline2);

    })

    test("should handle if no pre/post-filter or event handler is set", () => {
        const scenarioOutlineProcessor = new ScenarioOutlineProcessor<Feature>();
        const results = scenarioOutlineProcessor.process(scenarioOutline1, feature, 1);
        expect(results).toEqual(scenarioOutline1);
    });

    test("should filter by pre-filter", () => {
        const scenarioProcessor = new ScenarioOutlineProcessor<Feature>({
            preScenarioOutline(e: ScenarioOutline): boolean {
                return e.name === "2"
            },
        });
        const result1 = scenarioProcessor.preFilter(scenarioOutline1, feature, 1);
        const result2 = scenarioProcessor.preFilter(scenarioOutline2, feature, 1);
        expect(result1).toBe(true);
        expect(result2).toBe(false);        
    });
    
    test("should filter by post-filter", () => {
        const scenarioOutlineProcessor = new ScenarioOutlineProcessor<Feature>({
            postScenarioOutline(e: ScenarioOutline): boolean {
                return e.keyword === "4"
            },
        });
        const result1 = scenarioOutlineProcessor.postFilter(scenarioOutline1, feature, 1);
        const result2 = scenarioOutlineProcessor.postFilter(scenarioOutline2, feature, 1);
        expect(result1).toBe(false);
        expect(result2).toBe(true);        
    });
    
    test("should process scenarios", () => {
        const scenarioOutlineProcessor = new ScenarioOutlineProcessor<Feature>({
            onScenarioOutline(e: ScenarioOutline): ScenarioOutline {
                e.description += "1"
                return e;
            },
        });
        const result1 = scenarioOutlineProcessor.process(scenarioOutline1, feature, 1) as ScenarioOutline;
        const result2 = scenarioOutlineProcessor.process(scenarioOutline2, feature, 1) as ScenarioOutline;
        expect(result1.description).toBe("31");
        expect(result2.description).toBe("61");        
    });
    
    test("should process array of steps with event handler", () => {
        const scenarioOutlineProcessor = new ScenarioOutlineProcessor<Feature>({
            onScenarioOutline(e: ScenarioOutline): Array<ScenarioOutline> {
                const c = e.clone();
                c.keyword += "1"
                return [c, c];
            },
        });
        const results = scenarioOutlineProcessor.process(scenarioOutline1, feature, 1) as ScenarioOutline[];

        const keywords = results.map(s => s.keyword)

        expect(keywords).toHaveLength(2);
        expect(keywords).toEqual(["11", "11"]);
    });

    test("should handle null value", () => {
        const scenarioOutlineProcessor = new ScenarioOutlineProcessor<Feature>({
            onScenarioOutline(): Array<ScenarioOutline> {
                return null;
            },
        });
        const results = scenarioOutlineProcessor.process(scenarioOutline1, feature, 1) as ScenarioOutline[];

        expect(results).toBeNull();
    });
    
    test("should handle present and missing examples", () => {
        const scenarioOutlineProcessor = new ScenarioOutlineProcessor<Feature>({
            onScenarioOutline(e: ScenarioOutline): ScenarioOutline {
                const c = e.clone();
                c.examples.forEach(example => example.keyword += "1");
                return c;
            },
        });
        const result1 = scenarioOutlineProcessor.process(scenarioOutline1, feature, 1) as ScenarioOutline;
        const result2 = scenarioOutlineProcessor.process(scenarioOutline2, feature, 1) as ScenarioOutline;
        expect(result1.examples).toEqual([]);
        expect(result2.examples.map(example => example.keyword)).toEqual(["11", "21", "31"]);
    });
})