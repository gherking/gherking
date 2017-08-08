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
     */
    onScenario(scenario, parent) {

    }

    /**
     * Event to process a Background.
     *
     * @param {Background} background The background to be processed.
     * @param {Feature} parent The parent feature of the background.
     */
    onBackground(background, parent) {

    }

    /**
     * Event to process a ScenarioOutline.
     *
     * @param {ScenarioOutline} scenarioOutline The scenario outline to be processed.
     * @param {Feature} parent The parent feature of the scenario outline.
     */
    onScenarioOutline(scenarioOutline, parent) {

    }

    /**
     * Event to process a Step.
     *
     * @param {Step} step The step to be processed.
     * @param {Scenario|ScenarioOutline|Background} parent The parent element of the step.
     */
    onStep(step, parent) {

    }

    /**
     * Event to process a Tag.
     *
     * @param {Tag} tag The tag to be processed.
     * @param {Feature|Scenario|ScenarioOutline|Examples} parent The parent element of the tag.
     */
    onTag(tag, parent) {

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
     */
    onExamples(examples, parent) {

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
     */
    onExampleRow(row, parent) {

    }

    /**
     * Function to filter out scenarios of a feature (scenario, scenario outline)
     * before they are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Scenario|ScenarioOutline} scenario The scenario to be tested.
     * @param {Feature} parent The parent feature of the scenario.
     * @returns {boolean|*} FALSE if the given element should be filtered out.
     */
    preFilterScenario(scenario, parent) {

    }

    /**
     * Function to filter out scenarios of a feature (scenario, scenario outline)
     * after they are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Scenario|ScenarioOutline} scenario The scenario to be tested.
     * @param {Feature} parent The parent feature of the scenario.
     * @returns {boolean|*} FALSE if the given element should be filtered out.
     */
    postFilterScenario(scenario, parent) {

    }

    /**
     * Function to filter out tags of an element (feature, scenario, scenario outline, examples)
     * before tags are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Tag} tag The tag to be tested.
     * @param {Feature|Scenario|ScenarioOutline|Examples} parent The parent element of the tag.
     * @return {boolean|*} FALSE if the given tag should be filtered out.
     */
    preFilterTag(tag, parent) {

    }

    /**
     * Function to filter out tags of an element (feature, scenario, scenario outline, examples)
     * after tags are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Tag} tag The tag to be tested.
     * @param {Feature|Scenario|ScenarioOutline|Examples} parent The parent element of the tag.
     * @return {boolean|*} FALSE if the given tag should be filtered out.
     */
    postFilterTag(tag, parent) {

    }

    /**
     * Function to filter out steps of an element (background, scenario, scenario outline)
     * before steps are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Step} step The step to be tested.
     * @param {Background|Scenario|ScenarioOutline} parent The parent element of the step.
     * @return {boolean|*} FALSE if the given tag should be filtered out.
     */
    preFilterStep(step, parent) {

    }

    /**
     * Function to filter out steps of an element (background, scenario, scenario outline)
     * after steps are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Step} step The step to be tested.
     * @param {Background|Scenario|ScenarioOutline} parent The parent element of the step.
     * @return {boolean|*} FALSE if the given tag should be filtered out.
     */
    postFilterStep(step, parent) {

    }

    /**
     * Function to filter out rows of a dataTable of an example table,
     * before rows are processed.
     * Return FALSE if the given row should be filtered out. Otherwise it won't be.
     *
     * @param {TableRow} row The row to be tested.
     * @param {DataTable|Examples} parent The parent element of the row.
     * @return {boolean|*} FALSE if the given row should be filtered out.
     */
    preFilterRow(row, parent) {

    }

    /**
     * Function to filter out rows of a dataTable of an example table,
     * after rows are processed.
     * Return FALSE if the given row should be filtered out. Otherwise it won't be.
     *
     * @param {TableRow} row The row to be tested.
     * @param {DataTable|Examples} parent The parent element of the row.
     * @return {boolean|*} FALSE if the given row should be filtered out.
     */
    postFilterRow(row, parent) {

    }

    /**
     * Function to filter out examples tables, before examples tables are processed.
     * Return FALSE if the given examples table should be filtered out. Otherwise it won't be.
     *
     * @param {Examples} examples The examples table to be tested.
     * @param {ScenarioOutline} parent The parent scenario outline or the examples table.
     * @return {boolean|*} FALSE if the given examples table should be filtered out.
     */
    preFilterExamples(examples, parent) {

    }

    /**
     * Function to filter out examples tables, after examples tables are processed.
     * Return FALSE if the given examples table should be filtered out. Otherwise it won't be.
     *
     * @param {Examples} examples The examples table to be tested.
     * @param {ScenarioOutline} parent The parent scenario outline or the examples table.
     * @return {boolean|*} FALSE if the given examples table should be filtered out.
     */
    postFilterExamples(examples, parent) {

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
        return tags.filter(tag => {
            if (post) {
                return this.postFilterTag(tag, parent) !== false;
            }
            return this.preFilterTag(tag, parent) !== false;
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
        return rows.filter(row => {
            if (post) {
                return this.postFilterRow(row, parent) !== false;
            }
            return this.preFilterRow(row, parent) !== false;
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
        return examples.filter(table => {
            if (post) {
                return this.postFilterExamples(table, parent) !== false;
            }
            return this.preFilterExamples(table, parent) !== false;
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
        return scenarios.filter(element => {
            if (element.constructor.name === 'Background') {
                return true;
            }
            if (post) {
                return this.postFilterScenario(element, feature) !== false;
            }
            return this.preFilterScenario(element, feature) !== false;
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
        return steps.filter(step => {
            if (post) {
                return this.postFilterStep(step, parent) !== false;
            }
            return this.preFilterStep(step, parent) !== false;
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
        tags.forEach(tag => {
            this.onTag(tag, parent);
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
        feature.elements.forEach(element => {
            switch (element.constructor.name) {
                case 'Scenario':
                    this._applyToScenario(element, feature);
                    break;
                case 'ScenarioOutline':
                    this._applyToScenarioOutline(element, feature);
                    break;
                case 'Background':
                    this._applyToBackground(element, feature);
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
     * @private
     */
    _applyToScenario(scenario, feature) {
        this.onScenario(scenario, feature);

        scenario.tags = this._filterTags(scenario.tags, scenario);
        this._applyToTags(scenario.tags, scenario);
        scenario.tags = this._filterTags(scenario.tags, scenario, true);

        scenario.steps = this._filterSteps(scenario.steps, scenario);
        scenario.steps.forEach(step => {
            this._applyToStep(step, scenario);
        });
        scenario.steps = this._filterSteps(scenario.steps, scenario, true);
    }

    /**
     * Applies the process events to ScenarioOutline.
     *
     * @param {ScenarioOutline} scenarioOutline
     * @param {Feature} feature
     * @private
     */
    _applyToScenarioOutline(scenarioOutline, feature) {
        this.onScenarioOutline(scenarioOutline, feature);

        scenarioOutline.tags = this._filterTags(scenarioOutline.tags, scenarioOutline);
        this._applyToTags(scenarioOutline.tags, scenarioOutline);
        scenarioOutline.tags = this._filterTags(scenarioOutline.tags, scenarioOutline, true);

        scenarioOutline.steps = this._filterSteps(scenarioOutline.steps, scenarioOutline);
        scenarioOutline.steps.forEach(step => {
            this._applyToStep(step, scenarioOutline);
        });
        scenarioOutline.steps = this._filterSteps(scenarioOutline.steps, scenarioOutline, true);

        scenarioOutline.examples = this._filterExamples(scenarioOutline.examples, scenarioOutline);
        scenarioOutline.examples.forEach(examples => {
            this._applyToExamples(examples, scenarioOutline);
        });
        scenarioOutline.examples = this._filterExamples(scenarioOutline.examples, scenarioOutline, true);
    }

    /**
     * Applies the process events to Background.
     *
     * @param {Background} background
     * @param {Feature} feature
     * @private
     */
    _applyToBackground(background, feature) {
        this.onBackground(background, feature);

        background.steps = this._filterSteps(background.steps, background);
        background.steps.forEach(step => {
            this._applyToStep(step, background);
        });
        background.steps = this._filterSteps(background.steps, background, true);
    }

    /**
     * Applies the process events to Step.
     *
     * @param {Step} step
     * @param {Background|Scenario|ScenarioOutline} parent
     * @private
     */
    _applyToStep(step, parent) {
        this.onStep(step, parent);
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
     * @private
     */
    _applyToExamples(examples, scenarioOutline) {
        this.onExamples(examples, scenarioOutline);
        this.onExampleHeader(examples.header, examples);

        examples.tags = this._filterTags(examples.tags, examples);
        this._applyToTags(examples.tags, examples);
        examples.tags = this._filterTags(examples.tags, examples, true);

        examples.body = this._filterRows(examples.body, examples);
        examples.body.forEach(row => {
            this.onExampleRow(row, examples);
        });
        examples.body = this._filterRows(examples.body, examples, true);
    }
}

module.exports = PreProcessor;