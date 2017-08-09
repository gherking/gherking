'use strict';

/**
 * Base class to create Gherkin feature file pre-processors.
 * @class
 */
class PreProcessor {
    /**
     * Event to process a Feature.
     *
     * @param {Feature} feature The feature to be processed.
     */
    onFeature(feature) {

    }

    /**
     * Event to process a Scenario.
     *
     * @param {Scenario} scenario The scenario to be processed.
     * @param {Feature} parent The parent feature of the scenario.
     * @param {number} i The index of the current element.
     */
    onScenario(scenario, parent, i) {

    }

    /**
     * Event to process a Background.
     *
     * @param {Background} background The background to be processed.
     * @param {Feature} parent The parent feature of the background.
     * @param {number} i The index of the current element.
     */
    onBackground(background, parent, i) {

    }

    /**
     * Event to process a ScenarioOutline.
     *
     * @param {ScenarioOutline} scenarioOutline The scenario outline to be processed.
     * @param {Feature} parent The parent feature of the scenario outline.
     * @param {number} i The index of the current element.
     */
    onScenarioOutline(scenarioOutline, parent, i) {

    }

    /**
     * Event to process a Step.
     *
     * @param {Step} step The step to be processed.
     * @param {Scenario|ScenarioOutline|Background} parent The parent element of the step.
     * @param {number} i The index of the current element.
     */
    onStep(step, parent, i) {

    }

    /**
     * Event to process a Tag.
     *
     * @param {Tag} tag The tag to be processed.
     * @param {Feature|Scenario|ScenarioOutline|Examples} parent The parent element of the tag.
     * @param {number} i The index of the current element.
     */
    onTag(tag, parent, i) {

    }

    /**
     * Event to process a DocString.
     *
     * @param {DocString} docString The docString to be processed.
     * @param {Step} parent The parent step of the docString.
     */
    onDocString(docString, parent) {

    }

    /**
     * Event to process a DataTable.
     *
     * @param {DataTable} dataTable The dataTable to be processed.
     * @param {Step} parent The parent step of the dataTable.
     */
    onDataTable(dataTable, parent) {

    }

    /**
     * Event to process an Examples table.
     *
     * @param {Examples} examples The examples table to be processed.
     * @param {ScenarioOutline} parent The parent scenario outline of the examples table.
     * @param {number} i The index of the current element.
     */
    onExamples(examples, parent, i) {

    }

    /**
     * Event to process the header row of an Examples table.
     *
     * @param {TableRow} header The header of the examples table.
     * @param {Examples} parent The parent examples table of the header row.
     */
    onExampleHeader(header, parent) {

    }

    /**
     * Event to process a row of an Examples table.
     *
     * @param {TableRow} row A row of the examples table.
     * @param {Examples} parent The parent examples table of the row.
     * @param {number} i The index of the current element.
     */
    onExampleRow(row, parent, i) {

    }

    /**
     * Function to filter out scenarios of a feature (scenario, scenario outline)
     * before they are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Scenario|ScenarioOutline} scenario The scenario to be tested.
     * @param {Feature} parent The parent feature of the scenario.
     * @param {number} i The index of the current element.
     * @returns {boolean|*} FALSE if the given element should be filtered out.
     */
    preFilterScenario(scenario, parent, i) {

    }

    /**
     * Function to filter out scenarios of a feature (scenario, scenario outline)
     * after they are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Scenario|ScenarioOutline} scenario The scenario to be tested.
     * @param {Feature} parent The parent feature of the scenario.
     * @param {number} i The index of the current element.
     * @returns {boolean|*} FALSE if the given element should be filtered out.
     */
    postFilterScenario(scenario, parent, i) {

    }

    /**
     * Function to filter out tags of an element (feature, scenario, scenario outline, examples)
     * before tags are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Tag} tag The tag to be tested.
     * @param {Feature|Scenario|ScenarioOutline|Examples} parent The parent element of the tag.
     * @param {number} i The index of the current element.
     * @return {boolean|*} FALSE if the given tag should be filtered out.
     */
    preFilterTag(tag, parent, i) {

    }

    /**
     * Function to filter out tags of an element (feature, scenario, scenario outline, examples)
     * after tags are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Tag} tag The tag to be tested.
     * @param {Feature|Scenario|ScenarioOutline|Examples} parent The parent element of the tag.
     * @param {number} i The index of the current element.
     * @return {boolean|*} FALSE if the given tag should be filtered out.
     */
    postFilterTag(tag, parent, i) {

    }

    /**
     * Function to filter out steps of an element (background, scenario, scenario outline)
     * before steps are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Step} step The step to be tested.
     * @param {Background|Scenario|ScenarioOutline} parent The parent element of the step.
     * @param {number} i The index of the current element.
     * @return {boolean|*} FALSE if the given tag should be filtered out.
     */
    preFilterStep(step, parent, i) {

    }

    /**
     * Function to filter out steps of an element (background, scenario, scenario outline)
     * after steps are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Step} step The step to be tested.
     * @param {Background|Scenario|ScenarioOutline} parent The parent element of the step.
     * @param {number} i The index of the current element.
     * @return {boolean|*} FALSE if the given tag should be filtered out.
     */
    postFilterStep(step, parent, i) {

    }

    /**
     * Function to filter out rows of a dataTable of an example table,
     * before rows are processed.
     * Return FALSE if the given row should be filtered out. Otherwise it won't be.
     *
     * @param {TableRow} row The row to be tested.
     * @param {DataTable|Examples} parent The parent element of the row.
     * @param {number} i The index of the current element.
     * @return {boolean|*} FALSE if the given row should be filtered out.
     */
    preFilterRow(row, parent, i) {

    }

    /**
     * Function to filter out rows of a dataTable of an example table,
     * after rows are processed.
     * Return FALSE if the given row should be filtered out. Otherwise it won't be.
     *
     * @param {TableRow} row The row to be tested.
     * @param {DataTable|Examples} parent The parent element of the row.
     * @param {number} i The index of the current element.
     * @return {boolean|*} FALSE if the given row should be filtered out.
     */
    postFilterRow(row, parent, i) {

    }

    /**
     * Function to filter out examples tables, before examples tables are processed.
     * Return FALSE if the given examples table should be filtered out. Otherwise it won't be.
     *
     * @param {Examples} examples The examples table to be tested.
     * @param {ScenarioOutline} parent The parent scenario outline or the examples table.
     * @param {number} i The index of the current element.
     * @return {boolean|*} FALSE if the given examples table should be filtered out.
     */
    preFilterExamples(examples, parent, i) {

    }

    /**
     * Function to filter out examples tables, after examples tables are processed.
     * Return FALSE if the given examples table should be filtered out. Otherwise it won't be.
     *
     * @param {Examples} examples The examples table to be tested.
     * @param {ScenarioOutline} parent The parent scenario outline or the examples table.
     * @param {number} i The index of the current element.
     * @return {boolean|*} FALSE if the given examples table should be filtered out.
     */
    postFilterExamples(examples, parent, i) {

    }

    /**
     * Applies the preprocessor to the given AST.
     *
     * @param {GherkinDocument} ast
     * @returns {GherkinDocument}
     */
    applyToAST(ast) {
        const result = ast.clone();
        this._applyToFeature(result.feature);
        return result;
    }

    /**
     * Filters the given tags with the appropriate filter function.
     *
     * @param {Array.<Tag>} tags
     * @param {Feature|Scenario|ScenarioOutline|Background|Examples} parent
     * @param {boolean} [post] Should the post filter applied?
     * @returns {Array.<Tag>}
     * @private
     */
    _filterTags(tags, parent, post) {
        return tags.filter((tag ,i) => {
            if (post) {
                return this.postFilterTag(tag, parent, i) !== false;
            }
            return this.preFilterTag(tag, parent, i) !== false;
        });
    }

    /**
     * Filters the given rows with the appropriate filter function.
     *
     * @param {Array.<TableRow>} rows
     * @param {DataTable|Examples} parent
     * @param {boolean} [post] Should the post filter applied?
     * @returns {Array.<TableRow>}
     * @private
     */
    _filterRows(rows, parent, post) {
        return rows.filter((row, i) => {
            if (post) {
                return this.postFilterRow(row, parent, i) !== false;
            }
            return this.preFilterRow(row, parent, i) !== false;
        })
    }

    /**
     * Filters the given examples tables with the appropriate filter function.
     *
     * @param {Array.<Examples>} examples
     * @param {ScenarioOutline} parent
     * @param {boolean} [post] Should the post filter applied?
     * @returns {Array.<Examples>}
     * @private
     */
    _filterExamples(examples, parent, post) {
        return examples.filter((table, i) => {
            if (post) {
                return this.postFilterExamples(table, parent, i) !== false;
            }
            return this.preFilterExamples(table, parent, i) !== false;
        })
    }

    /**
     * Filters the given scenarios with the appropriate filter function.
     *
     * @param {Array.<Scenario|ScenarioOutline>} scenarios
     * @param {Feature|Scenario|ScenarioOutline|Background|Examples} feature
     * @param {boolean} [post] Should the post filter applied?
     * @returns {Array.<Scenario|ScenarioOutline>}
     * @private
     */
    _filterScenarios(scenarios, feature, post) {
        return scenarios.filter((element, i) => {
            if (post) {
                return this.postFilterScenario(element, feature, i) !== false;
            }
            return this.preFilterScenario(element, feature, i) !== false;
        });
    }

    /**
     * Filters the given scenarios with the appropriate filter function.
     *
     * @param {Array.<Step>} steps
     * @param {Scenario|ScenarioOutline|Background} parent
     * @param {boolean} [post] Should the post filter applied?
     * @returns {Array.<Step>}
     * @private
     */
    _filterSteps(steps, parent, post) {
        return steps.filter((step, i) => {
            if (post) {
                return this.postFilterStep(step, parent, i) !== false;
            }
            return this.preFilterStep(step, parent, i) !== false;
        });
    }

    /**
     * Applies the process events on Fags.
     *
     * @param {Array.<Tag>} tags
     * @param {Feature|Scenario|ScenarioOutline|Background|Examples} parent
     * @private
     */
    _applyToTags(tags, parent) {
        tags.forEach((tag, i) => {
            this.onTag(tag, parent, i);
        });
    }

    /**
     * Applies the process events to Feature.
     *
     * @param {Feature} feature
     * @private
     */
    _applyToFeature(feature) {
        this.onFeature(feature);

        feature.tags = this._filterTags(feature.tags, feature);
        this._applyToTags(feature.tags, feature);
        feature.tags = this._filterTags(feature.tags, feature, true);

        feature.elements = this._filterScenarios(feature.elements, feature);
        feature.elements.forEach((element, i) => {
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
        });
        feature.elements = this._filterScenarios(feature.elements, feature, true);
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
        this.onScenario(scenario, feature, i);

        scenario.tags = this._filterTags(scenario.tags, scenario);
        this._applyToTags(scenario.tags, scenario);
        scenario.tags = this._filterTags(scenario.tags, scenario, true);

        scenario.steps = this._filterSteps(scenario.steps, scenario);
        scenario.steps.forEach((step, i) => {
            this._applyToStep(step, scenario, i);
        });
        scenario.steps = this._filterSteps(scenario.steps, scenario, true);
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
        this.onScenarioOutline(scenarioOutline, feature, i);

        scenarioOutline.tags = this._filterTags(scenarioOutline.tags, scenarioOutline);
        this._applyToTags(scenarioOutline.tags, scenarioOutline);
        scenarioOutline.tags = this._filterTags(scenarioOutline.tags, scenarioOutline, true);

        scenarioOutline.steps = this._filterSteps(scenarioOutline.steps, scenarioOutline);
        scenarioOutline.steps.forEach((step, i) => {
            this._applyToStep(step, scenarioOutline, i);
        });
        scenarioOutline.steps = this._filterSteps(scenarioOutline.steps, scenarioOutline, true);

        scenarioOutline.examples = this._filterExamples(scenarioOutline.examples, scenarioOutline);
        scenarioOutline.examples.forEach((examples, i) => {
            this._applyToExamples(examples, scenarioOutline, i);
        });
        scenarioOutline.examples = this._filterExamples(scenarioOutline.examples, scenarioOutline, true);
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
        this.onBackground(background, feature, i);

        background.steps = this._filterSteps(background.steps, background);
        background.steps.forEach((step, i) => {
            this._applyToStep(step, background, i);
        });
        background.steps = this._filterSteps(background.steps, background, true);
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
        this.onStep(step, parent, i);
        if (step.argument) {
            switch (step.argument.constructor.name) {
                case 'DocString':
                    this.onDocString(step.argument, step);
                    break;
                case 'DataTable':
                    step.argument.rows = this._filterRows(step.argument.rows, step.argument);
                    this.onDataTable(step.argument, step);
                    step.argument.rows = this._filterRows(step.argument.rows, step.argument, true);
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
        this.onExamples(examples, scenarioOutline, i);
        this.onExampleHeader(examples.header, examples);

        examples.tags = this._filterTags(examples.tags, examples);
        this._applyToTags(examples.tags, examples);
        examples.tags = this._filterTags(examples.tags, examples, true);

        examples.body = this._filterRows(examples.body, examples);
        examples.body.forEach((row, i) => {
            this.onExampleRow(row, examples, i);
        });
        examples.body = this._filterRows(examples.body, examples, true);
    }
}

module.exports = PreProcessor;