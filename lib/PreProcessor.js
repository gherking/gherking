'use strict';

class PreProcessor {
    onFeature(feature) {

    }

    onScenario(scenario, parent) {

    }

    onBackground(background, parent) {

    }

    onScenarioOutline(scenarioOutline, parent) {

    }

    onStep(step, parent) {

    }

    onTag(tag, parent) {

    }

    onDocString(docString, parent) {

    }

    onDataTable(dataTable, parent) {

    }

    onExamples(examples, parent) {

    }

    onExampleRow(row, parent) {

    }

    /**
     * Applies the preprocessor to the given AST.
     * @param {GherkinDocument} ast
     * @returns {GherkinDocument}
     */
    applyToAST(ast) {
        this._applyToFeature(ast.feature);
        return ast;
    }

    _applyToTags(tags, parent) {
        tags.forEach(tag => {
            this.onTag(tag, parent);
        });
    }

    _applyToFeature(feature) {
        this.onFeature(feature);
        this._applyToTags(feature.tags, feature);
        feature.elements.forEach(element => {
            switch(element.constructor.name) {
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
    }

    _applyToScenario(scenario, feature) {
        this.onScenario(scenario, feature);
        this._applyToTags(scenario.tags, scenario);
        scenario.steps.forEach(step => {
            this._applyToStep(step, scenario);
        });
    }

    _applyToScenarioOutline(scenarioOutline, feature) {
        this.onScenarioOutline(scenarioOutline, feature);
        this._applyToTags(scenarioOutline.tags, scenarioOutline);
        scenarioOutline.steps.forEach(step => {
            this._applyToStep(step, scenarioOutline);
        });
        scenarioOutline.examples.forEach(examples => {
            this._applyToExamples(examples, scenarioOutline);
        });
    }

    _applyToBackground(background, feature) {
        this.onBackground(background, feature);
        this._applyToTags(background.tags, background);
        background.steps.forEach(step => {
            this._applyToStep(step, background);
        });
    }

    _applyToStep(step, parent) {
        this.onStep(step, parent);
        if (step.argument) {
            switch(step.argument.constructor.name) {
                case 'DocString':
                    this.onDocString(step.argument, step);
                    break;
                case 'DataTable':
                    this.onDataTable(step.argument, step);
                    break;
            }
        }
    }

    _applyToExamples(examples, scenarioOutline) {

    }
}

module.exports = PreProcessor;