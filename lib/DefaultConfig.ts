'use strict';

import {
    Background,
    DataTable,
    DocString,
    Examples,
    Feature,
    Rule,
    Scenario,
    ScenarioOutline,
    Step,
    TableRow,
    Tag
} from 'gherkin-ast';

/**
 * Base class to create Gherkin feature file pre-compilers.
 * @class
 */
export class DefaultConfig {
    /**
     * Event to process a Feature.
     *
     * @param {Feature} feature The feature to be processed.
     * @return {null|undefined|Feature}
     */
    onFeature(feature: Feature): null | undefined | Feature {
        return null;
    }

    /**
     *
     * @param {Rule} rule The rule to be processed
     * @param {Feature} parent The parent feature of the rule
     * @param {number} i The index of the current element
     * @return {null|undefined|Scenario|Array.<Rule>}
     */
    onRule(rule: Rule, parent: Feature, i: number): null | undefined | Rule | Array<Rule> {
        return null;
    }

    /**
     * Event to process a Scenario.
     *
     * @param {Scenario} scenario The scenario to be processed.
     * @param {Feature} parent The parent feature of the scenario.
     * @param {number} i The index of the current element.
     * @return {null|undefined|Scenario|Array.<Scenario>}
     */
    onScenario(scenario: Scenario, parent: Feature | Rule, i: number): null | undefined | Scenario | Array<Scenario> {
        return null;
    }

    /**
     * Event to process a Background.
     *
     * @param {Background} background The background to be processed.
     * @param {Feature | Rule} parent The parent feature of the background.
     * @param {number} i The index of the current element.
     * @return {null|undefined|Background|Array.<Background>}
     */
    onBackground(background: Background, parent: Feature | Rule, i: number): null | undefined | Background | Array<Background> {
        return null;
    }

    /**
     * Event to process a ScenarioOutline.
     *
     * @param {ScenarioOutline} scenarioOutline The scenario outline to be processed.
     * @param {Feature} parent The parent feature of the scenario outline.
     * @param {number} i The index of the current element.
     * @return {null|undefined|ScenarioOutline|Array.<ScenarioOutline>}
     */
    onScenarioOutline(scenarioOutline: ScenarioOutline, parent: Feature, i: number): null | undefined | ScenarioOutline | Array<ScenarioOutline> {
        return null;
    }

    /**
     * Event to process a Step.
     *
     * @param {Step} step The step to be processed.
     * @param {Scenario|ScenarioOutline|Background} parent The parent element of the step.
     * @param {number} i The index of the current element.
     * @return {null|undefined|Step|Array.<Step>}
     */
    onStep(step: Step, parent: Scenario | ScenarioOutline | Background, i: number): null | undefined | Step | Array<Step> {
        return null;
    }

    /**
     * Event to process a Tag.
     *
     * @param {Tag} tag The tag to be processed.
     * @param {Feature|Scenario|ScenarioOutline|Examples} parent The parent element of the tag.
     * @param {number} i The index of the current element.
     * @return {null|undefined|Tag|Array.<Tag>}
     */
    onTag(tag: Tag, parent: Feature | Scenario | ScenarioOutline | Examples, i: number): null | undefined | Tag | Array<Tag> {
        return null;
    }

    /**
     * Event to process a DocString.
     *
     * @param {DocString} docString The docString to be processed.
     * @param {Step} parent The parent step of the docString.
     * @return {null|undefined|DocString}
     */
    onDocString(docString: DocString, parent: Step): null | undefined | DocString {
        return null;
    }

    /**
     * Event to process a DataTable.
     *
     * @param {DataTable} dataTable The dataTable to be processed.
     * @param {Step} parent The parent step of the dataTable.
     * @return {null|undefined|DataTable}
     */
    onDataTable(dataTable: DataTable, parent: Step): null | undefined | DataTable {
        return null;
    }

    /**
     * Event to process an Examples table.
     *
     * @param {Examples} examples The examples table to be processed.
     * @param {ScenarioOutline} parent The parent scenario outline of the examples table.
     * @param {number} i The index of the current element.
     * @return {null|undefined|Tag|Array.<Tag>}
     */
    onExamples(examples: Examples, parent: ScenarioOutline, i: number): null | undefined | Tag | Array<Tag> {
        return null;
    }

    /**
     * Event to process the header row of an Examples table.
     *
     * @param {TableRow} header The header of the examples table.
     * @param {Examples} parent The parent examples table of the header row.
     * @return {null|undefined|Tag|Array.<Tag>}
     */
    onExampleHeader(header: TableRow, parent: Examples): null | undefined | Tag | Array<Tag> {
        return null;
    }

    /**
     * Event to process a row of an Examples table.
     *
     * @param {TableRow} row A row of the examples table.
     * @param {Examples} parent The parent examples table of the row.
     * @param {number} i The index of the current element.
     * @return {null|undefined|TableRow|Array.<TableRow>}
     */
    onExampleRow(row: TableRow, parent: Examples, i: number): null | undefined | TableRow | Array<TableRow> {
        return null;
    }

    /**
     * Function to filter out rules of a feature
     * before they are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Rule} rule The rule to be tested.
     * @param {Feature} parent The parent feature of the scenario.
     * @param {number} i The index of the current element.
     * @returns {boolean|*} FALSE if the given element should be filtered out.
     */
    preFilterRule(rule: Rule, parent: Feature, i: number): boolean | any {
        return null;
    }

    /**
     * Function to filter out scenarios of a rule
     * after they are processed.
     * Return FALSE if the given element should be filtered out. Otherwise it won't be.
     *
     * @param {Rule} rule The rule to be tested.
     * @param {Feature} parent The parent feature of the scenario.
     * @param {number} i The index of the current element.
     * @returns {boolean|*} FALSE if the given element should be filtered out.
     */
    postFilterRule(rule: Rule, parent: Feature, i: number): boolean | any {
        return null;
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
    preFilterScenario(scenario: Scenario | ScenarioOutline, parent: Feature | Rule, i: number): boolean | any {
        return null;
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
    postFilterScenario(scenario: Scenario | ScenarioOutline, parent: Feature | Rule, i: number): boolean | any {
        return null;
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
    preFilterTag(tag: Tag, parent: Feature | Scenario | ScenarioOutline | Examples, i: number): boolean | any {
        return null;
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
    postFilterTag(tag: Tag, parent: Feature | Scenario | ScenarioOutline | Examples, i: number): boolean | any {
        return null;
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
    preFilterStep(step: Step, parent: Background | Scenario | ScenarioOutline, i: number): boolean | any {
        return null;
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
    postFilterStep(step: Step, parent: Background | Scenario | ScenarioOutline, i: number): boolean | any {
        return null;
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
    preFilterRow(row: TableRow, parent: DataTable | Examples, i: number): boolean | any {
        return null;
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
    postFilterRow(row: TableRow, parent: DataTable | Examples, i: number): boolean | any {
        return null;
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
    preFilterExamples(examples: Examples, parent: ScenarioOutline, i: number): boolean | any {
        return null;
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
    postFilterExamples(examples: Examples, parent: ScenarioOutline, i: number): boolean | any {
        return null;
    }
}