'use strict';
/**
 * Base class to create Gherkin feature file pre-compilers.
 * @class
 */
class DefaultConfig {
    /**
     * Event to process a Feature.
     *
     * @param {Feature} feature The feature to be processed.
     * @return {null|undefined|Feature}
     */
    onFeature(feature) {

    }

    /**
     * Event to process a Scenario.
     *
     * @param {Scenario} scenario The scenario to be processed.
     * @param {Feature} parent The parent feature of the scenario.
     * @param {number} i The index of the current element.
     * @return {null|undefined|Scenario|Array.<Scenario>}
     */
    onScenario(scenario, parent, i) {

    }

    /**
     * Event to process a Background.
     *
     * @param {Background} background The background to be processed.
     * @param {Feature} parent The parent feature of the background.
     * @param {number} i The index of the current element.
     * @return {null|undefined|Background|Array.<Background>}
     */
    onBackground(background, parent, i) {

    }

    /**
     * Event to process a ScenarioOutline.
     *
     * @param {ScenarioOutline} scenarioOutline The scenario outline to be processed.
     * @param {Feature} parent The parent feature of the scenario outline.
     * @param {number} i The index of the current element.
     * @return {null|undefined|ScenarioOutline|Array.<ScenarioOutline>}
     */
    onScenarioOutline(scenarioOutline, parent, i) {

    }

    /**
     * Event to process a Step.
     *
     * @param {Step} step The step to be processed.
     * @param {Scenario|ScenarioOutline|Background} parent The parent element of the step.
     * @param {number} i The index of the current element.
     * @return {null|undefined|Step|Array.<Step>}
     */
    onStep(step, parent, i) {

    }

    /**
     * Event to process a Tag.
     *
     * @param {Tag} tag The tag to be processed.
     * @param {Feature|Scenario|ScenarioOutline|Examples} parent The parent element of the tag.
     * @param {number} i The index of the current element.
     * @return {null|undefined|Tag|Array.<Tag>}
     */
    onTag(tag, parent, i) {

    }

    /**
     * Event to process a DocString.
     *
     * @param {DocString} docString The docString to be processed.
     * @param {Step} parent The parent step of the docString.
     * @return {null|undefined|DocString}
     */
    onDocString(docString, parent) {

    }

    /**
     * Event to process a DataTable.
     *
     * @param {DataTable} dataTable The dataTable to be processed.
     * @param {Step} parent The parent step of the dataTable.
     * @return {null|undefined|DataTable}
     */
    onDataTable(dataTable, parent) {

    }

    /**
     * Event to process an Examples table.
     *
     * @param {Examples} examples The examples table to be processed.
     * @param {ScenarioOutline} parent The parent scenario outline of the examples table.
     * @param {number} i The index of the current element.
     * @return {null|undefined|Tag|Array.<Tag>}
     */
    onExamples(examples, parent, i) {

    }

    /**
     * Event to process the header row of an Examples table.
     *
     * @param {TableRow} header The header of the examples table.
     * @param {Examples} parent The parent examples table of the header row.
     * @return {null|undefined|Tag|Array.<Tag>}
     */
    onExampleHeader(header, parent) {

    }

    /**
     * Event to process a row of an Examples table.
     *
     * @param {TableRow} row A row of the examples table.
     * @param {Examples} parent The parent examples table of the row.
     * @param {number} i The index of the current element.
     * @return {null|undefined|TableRow|Array.<TableRow>}
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
}

module.exports = DefaultConfig;