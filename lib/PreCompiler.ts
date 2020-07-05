'use strict';
import { GherkinDocument } from 'gherkin-ast';
import { DefaultConfig } from "./DefaultConfig";

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
        EXAMPLE_ROW: 'onExampleRow'
    }
};

/**
 * Gherkin feature file pre-compilers.
 * @class
 */
export class PreCompiler {
    /** Config of the precompiler */
    public config: Object|DefaultConfig;

    constructor(config: Object) {
        this.config = config || {};
    }

    /**
     * Applies the pre-compiler to the given AST.
     *
     * @param {GherkinDocument} ast
     * @returns {GherkinDocument}
     */
    public applyToAST(ast: GherkinDocument): GherkinDocument {
        const result: GherkinDocument = ast.clone();
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
    _handleEvent(parent: Object, key:string, method:string): void {
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
    _handleListEvent(list, parent, i, method) {
        if (this.config[method]) {
            const result = this.config[method](list[i], parent, i);
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
     * Applies the process events on Fags.
     *
     * @param {Array.<Tag>} tags
     * @param {Feature|Scenario|ScenarioOutline|Background|Examples} parent
     * @private
     */
    _applyToTags(tags, parent) {
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
    _applyToFeature(feature, doc) {
        this._handleEvent(doc, 'feature', METHODS.EVENT.FEATURE);

        feature.tags = this._filter(feature.tags, feature, METHODS.FILTER.TAG.PRE);
        this._applyToTags(feature.tags, feature);
        feature.tags = this._filter(feature.tags, feature, METHODS.FILTER.TAG.POST);

        feature.elements = this._filter(feature.elements, feature, METHODS.FILTER.SCENARIO.PRE);
        for (let i = 0; i < feature.elements.length; ++i) {
            const element = feature.elements[i];
            switch (element.constructor.name) {
                case 'Scenario':
                    this._applyToScenario(element, feature, i);
                    break;
                case 'ScenarioOutline':
                    this._applyToScenarioOutline(element, feature, i);
                    break;
                case 'Background':
                    this._applyToBackground(element, feature, i);
                    break;
            }
        }
        feature.elements = this._filter(feature.elements, feature, METHODS.FILTER.SCENARIO.POST);
    }

    /**
     * Applies the process events to Scenario.
     *
     * @param {Scenario} scenario
     * @param {Feature} feature
     * @param {number} i
     * @private
     */
    _applyToScenario(scenario, feature, i) {
        this._handleListEvent(feature.elements, feature, i, 'onScenario');

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
    _applyToScenarioOutline(scenarioOutline, feature, i) {
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
     * @param {Feature} feature
     * @param {number} i
     * @private
     */
    _applyToBackground(background, feature, i) {
        this._handleListEvent(feature.elements, feature, i, METHODS.EVENT.BACKGROUND);

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
    _applyToStep(step, parent, i) {
        this._handleListEvent(parent.steps, parent, i, METHODS.EVENT.STEP);
        if (step.argument) {
            switch (step.argument.constructor.name) {
                case 'DocString':
                    this._handleEvent(step, 'argument', METHODS.EVENT.DOC_STRING);
                    break;
                case 'DataTable':
                    step.argument.rows = this._filter(step.argument.rows, step.argument, METHODS.FILTER.ROW.PRE);
                    this._handleEvent(step, 'argument', METHODS.EVENT.DATA_TABLE);
                    step.argument.rows = this._filter(step.argument.rows, step.argument, METHODS.FILTER.ROW.POST);
                    break;
            }
        }
    }

    /**
     * Applies the process events to Examples.
     * @param {Examples} examples
     * @param {ScenarioOutline} scenarioOutline
     * @param {number} i
     * @private
     */
    _applyToExamples(examples, scenarioOutline, i) {
        this._handleListEvent(scenarioOutline.examples, scenarioOutline, i, METHODS.EVENT.EXAMPLES);
        this._handleEvent(examples, 'header', METHODS.EVENT.EXAMPLE_HEADER);

        examples.tags = this._filter(examples.tags, examples, METHODS.FILTER.TAG.PRE);
        this._applyToTags(examples.tags, examples);
        examples.tags = this._filter(examples.tags, examples, METHODS.FILTER.TAG.POST);

        examples.body = this._filter(examples.body, examples, METHODS.FILTER.ROW.PRE);
        for(let i = 0; i < examples.body.length; ++i) {
            this._handleListEvent(examples.body, examples, i, METHODS.EVENT.EXAMPLE_ROW);
        }
        examples.body = this._filter(examples.body, examples, METHODS.FILTER.ROW.POST);
    }
}