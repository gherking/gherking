'use strict';
import {
    Background,
    DataTable,
    DocString,
    Document,
    Examples,
    Feature,
    GherkinDocument,
    Rule,
    Scenario,
    ScenarioOutline,
    Step,
    TableRow,
    Tag
} from 'gherkin-ast';
import {DefaultConfig} from "./DefaultConfig";

const METHODS = {
    FILTER: {
        TAG: {
            PRE: 'preFilterTag',
            POST: 'postFilterTag'
        },
        SCENARIO: {
            PRE: 'preFilterScenario',
            POST: 'postFilterScenario'
        },
        STEP: {
            PRE: 'preFilterStep',
            POST: 'postFilterStep'
        },
        ROW: {
            PRE: 'preFilterRow',
            POST: 'postFilterRow'
        },
        EXAMPLES: {
            PRE: 'preFilterExamples',
            POST: 'postFilterExamples'
        },
        RULE: {
            PRE: "preFilterRule",
            POST: "postFilterRule"
        }
    },
    EVENT: {
        FEATURE: 'onFeature',
        SCENARIO: 'onScenario',
        BACKGROUND: 'onBackground',
        SCENARIO_OUTLINE: 'onScenarioOutline',
        STEP: 'onStep',
        TAG: 'onTag',
        DOC_STRING: 'onDocString',
        DATA_TABLE: 'onDataTable',
        EXAMPLES: 'onExamples',
        EXAMPLE_HEADER: 'onExampleHeader',
        EXAMPLE_ROW: 'onExampleRow',
        RULE: 'onRule'
    }
};

/**
 * Gherkin feature file pre-compilers.
 * @class
 */
export class PreCompiler {
    /** Config of the precompiler */
    public config: Object | DefaultConfig;

    constructor(config: Object) {
        this.config = config || {};
    }

    /**
     * Applies the pre-compiler to the given AST.
     *
     * @param {Document} ast
     * @returns {Document}
     */
    public applyToAST(ast: Document): Document {
        const result: Document = ast.clone();
        this._applyToFeature(result.feature, result);
        return result;
    }

    /**
     * Filters the given list with given method.
     *
     * @param {Array} list
     * @param {Object} parent
     * @param {string} method
     * @returns {Array}
     * @private
     */
    _filter(list: Array<any>, parent: Object, method: string): Array<any> {
        if (!this.config[method]) {
            return list;
        }
        return list.filter((item, i) => this.config[method](item, parent, i) !== false);
    }

    /**
     * Applies the given event method on the given element and
     * handles various return value possibilities.
     *
     * @param {Object} parent
     * @param {string} key
     * @param {string} method
     * @private
     */
    _handleEvent(parent: Object, key: string, method: string): void {
        if (this.config[method]) {
            const result: Object = this.config[method](parent[key], parent);
            if (result !== undefined) {
                parent[key] = result;
            }
        }
    }

    /**
     * Applies the given event method on the given list element
     * and handles various return value possiblities.
     *
     * @param {Array} list
     * @param {Object} parent
     * @param {number} i
     * @param {string} method
     * @private
     */
    _handleListEvent(list: Array<any>, parent: Object, i: number, method: string): void {
        if (this.config[method]) {
            const result: Object | DefaultConfig = this.config[method](list[i], parent, i);
            if (result === null) {
                list.splice(i, 1);
            } else if (Array.isArray(result)) {
                list.splice.apply(list, [i, 1].concat(result));
            } else if (result !== undefined) {
                list[i] = result;
            }
        }
    }

    /**
     * Applies the process events on Tags.
     *
     * @param {Array.<Tag>} tags
     * @param {Feature|Scenario|ScenarioOutline|Background|Examples} parent
     * @private
     */
    _applyToTags(tags: Array<Tag>, parent: Feature | Scenario | ScenarioOutline | Background | Examples): void {
        for (let i = 0; i < tags.length; ++i) {
            this._handleListEvent(tags, parent, i, METHODS.EVENT.TAG);
        }
    }

    /**
     * Applies the process events to Feature.
     *
     * @param {Feature} feature
     * @param {GherkinDocument} doc
     * @private
     */
    _applyToFeature(feature: Feature, doc: Document): void {
        this._handleEvent(doc, 'feature', METHODS.EVENT.FEATURE);

        feature.tags = this._filter(feature.tags, feature, METHODS.FILTER.TAG.PRE);
        this._applyToTags(feature.tags, feature);
        feature.tags = this._filter(feature.tags, feature, METHODS.FILTER.TAG.POST);
        let containsRule = false;
        for (let i = 0; i < feature.elements.length; ++i) {
            if (feature.elements[i] instanceof Rule) {
                containsRule = true;
                break;
            }
        }
        if (containsRule) {
            feature.elements = this._filter(feature.elements, feature, METHODS.FILTER.RULE.PRE);
            for (let i = 0; i < feature.elements.length; ++i) {
                this._applyToRule(<Rule>feature.elements[i], feature, i)
            }
            feature.elements = this._filter(feature.elements, feature, METHODS.FILTER.RULE.PRE);
        }
        else {
            feature.elements = this._filter(feature.elements, feature, METHODS.FILTER.SCENARIO.PRE);
            for (let i = 0; i < feature.elements.length; ++i) {
                const element: Scenario | ScenarioOutline | Background | Rule = feature.elements[i];
                if (element instanceof Scenario) {
                    this._applyToScenario(element, feature, i);
                } else if (element instanceof ScenarioOutline) {
                    this._applyToScenarioOutline(element, feature, i);
                } else if (element instanceof Background) {
                    this._applyToBackground(element, feature, i);
                }
            }
            feature.elements = this._filter(feature.elements, feature, METHODS.FILTER.SCENARIO.POST);
        }
    }

    /**
     * Applies the process events to Rule
     * @param {Rule} rule
     * @param {Feature} feature
     * @param {number} i
     * @private
     */
    _applyToRule(rule: Rule, feature: Feature, i: number): void {
        this._handleListEvent(feature.elements, feature, i, METHODS.EVENT.RULE);

        rule.elements = this._filter(rule.elements, rule, METHODS.FILTER.SCENARIO.PRE);
        for (let i = 0; i < rule.elements.length; ++i) {
            const element: Scenario | Background = rule.elements[i];
            if (element instanceof Scenario) {
                this._applyToScenario(element, rule, i);
            } else if (element instanceof Background) {
                this._applyToBackground(element, rule, i);
            }
        }
        rule.elements = this._filter(rule.elements, rule, METHODS.FILTER.SCENARIO.POST);
    }

    /**
     * Applies the process events to Scenario.
     *
     * @param {Scenario} scenario
     * @param {Feature|Rule} parent
     * @param {number} i
     * @private
     */
    _applyToScenario(scenario: Scenario, parent: Feature | Rule, i: number): void {
        this._handleListEvent(parent.elements, parent, i, 'onScenario');

        scenario.tags = this._filter(scenario.tags, scenario, METHODS.FILTER.TAG.PRE);
        this._applyToTags(scenario.tags, scenario);
        scenario.tags = this._filter(scenario.tags, scenario, METHODS.FILTER.TAG.POST);

        scenario.steps = this._filter(scenario.steps, scenario, METHODS.FILTER.STEP.PRE);
        for (let i = 0; i < scenario.steps.length; ++i) {
            this._applyToStep(scenario.steps[i], scenario, i);
        }
        scenario.steps = this._filter(scenario.steps, scenario, METHODS.FILTER.STEP.POST);
    }

    /**
     * Applies the process events to ScenarioOutline.
     *
     * @param {ScenarioOutline} scenarioOutline
     * @param {Feature} feature
     * @param {number} i
     * @private
     */
    _applyToScenarioOutline(scenarioOutline: ScenarioOutline, feature: Feature, i: number): void {
        this._handleListEvent(feature.elements, feature, i, METHODS.EVENT.SCENARIO_OUTLINE);

        scenarioOutline.tags = this._filter(scenarioOutline.tags, scenarioOutline, METHODS.FILTER.TAG.PRE);
        this._applyToTags(scenarioOutline.tags, scenarioOutline);
        scenarioOutline.tags = this._filter(scenarioOutline.tags, scenarioOutline, METHODS.FILTER.TAG.POST);

        scenarioOutline.steps = this._filter(scenarioOutline.steps, scenarioOutline, METHODS.FILTER.STEP.PRE);
        for (let i = 0; i < scenarioOutline.steps.length; ++i) {
            this._applyToStep(scenarioOutline.steps[i], scenarioOutline, i);
        }
        scenarioOutline.steps = this._filter(scenarioOutline.steps, scenarioOutline, METHODS.FILTER.STEP.POST);

        scenarioOutline.examples = this._filter(scenarioOutline.examples, scenarioOutline, METHODS.FILTER.EXAMPLES.PRE);
        for (let i = 0; i < scenarioOutline.examples.length; ++i) {
            this._applyToExamples(scenarioOutline.examples[i], scenarioOutline, i);
        }
        scenarioOutline.examples = this._filter(scenarioOutline.examples, scenarioOutline, METHODS.FILTER.EXAMPLES.POST);
    }

    /**
     * Applies the process events to Background.
     *
     * @param {Background} background
     * @param {Feature|Rule} parent
     * @param {number} i
     * @private
     */
    _applyToBackground(background: Background, parent: Feature | Rule, i: number): void {
        this._handleListEvent(parent.elements, parent, i, METHODS.EVENT.BACKGROUND);

        background.steps = this._filter(background.steps, background, METHODS.FILTER.STEP.PRE);
        for (let i = 0; i < background.steps.length; ++i) {
            this._applyToStep(background.steps[i], background, i);
        }
        background.steps = this._filter(background.steps, background, METHODS.FILTER.STEP.POST);
    }

    /**
     * Applies the process events to Step.
     *
     * @param {Step} step
     * @param {Background|Scenario|ScenarioOutline} parent
     * @param {number} i
     * @private
     */
    _applyToStep(step: Step, parent: Background | Scenario | ScenarioOutline, i: number): void {
        this._handleListEvent(parent.steps, parent, i, METHODS.EVENT.STEP);
        if (step.docString) {
            this._handleEvent(step, 'argument', METHODS.EVENT.DOC_STRING);
        } else if (step.dataTable) {
            step.dataTable.rows = this._filter(step.dataTable.rows, step.dataTable, METHODS.FILTER.ROW.PRE);
            this._handleEvent(step, 'argument', METHODS.EVENT.DATA_TABLE);
            step.dataTable.rows = this._filter(step.dataTable.rows, step.dataTable, METHODS.FILTER.ROW.POST);
        }
    }

    /**
     * Applies the process events to Examples.
     * @param {Examples} examples
     * @param {ScenarioOutline} scenarioOutline
     * @param {number} i
     * @private
     */
    _applyToExamples(examples: Examples, scenarioOutline: ScenarioOutline, i: number): void {
        this._handleListEvent(scenarioOutline.examples, scenarioOutline, i, METHODS.EVENT.EXAMPLES);
        this._handleEvent(examples, 'header', METHODS.EVENT.EXAMPLE_HEADER);

        examples.tags = this._filter(examples.tags, examples, METHODS.FILTER.TAG.PRE);
        this._applyToTags(examples.tags, examples);
        examples.tags = this._filter(examples.tags, examples, METHODS.FILTER.TAG.POST);

        examples.body = this._filter(examples.body, examples, METHODS.FILTER.ROW.PRE);
        for (let i = 0; i < examples.body.length; ++i) {
            this._handleListEvent(examples.body, examples, i, METHODS.EVENT.EXAMPLE_ROW);
        }
        examples.body = this._filter(examples.body, examples, METHODS.FILTER.ROW.POST);
    }
}