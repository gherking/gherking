'use strict';

const DefaultConfig = require('../DefaultConfig');

class Replacer extends DefaultConfig {
    /**
     *
     * @param {Object} config
     */
    constructor(config) {
        super();
        if (typeof config !== 'object') {
            throw new TypeError('Configuration is not an object: ' + config);
        }
        this.config = config;
    }

    replaceAll(obj, ...keys) {
        keys.forEach(key => {
            if (obj[key]) {
                Object.keys(this.config).forEach(toReplace => {
                    const replaceWith = this.config[toReplace];
                    obj[key] = obj[key].replace(new RegExp('\$\{' + toReplace + '\}', 'gi'), replaceWith);
                });
            }
        });
    }

    replaceInTableRow(row) {
        row.cells.forEach( cell => {
            this.replaceAll(cell, 'value');
        });
    }

    /**
     *
     * @param {Feature|Object} feature
     */
    onFeature(feature) {
        this.replaceAll(feature, 'name', 'description');
    }

    onBackground(background) {
        this.replaceAll(background, 'name', 'description');
    }

    onScenarioOutline(scenarioOutline) {
        this.replaceAll(scenarioOutline, 'name', 'description');
    }

    onScenario(scenario) {
        this.replaceAll(scenario, 'name', 'description');
    }

    onStep(step) {
        this.replaceAll(step, 'text');
    }

    onTag(tag) {
        this.replaceAll(tag, 'name');
    }

    onExamples(examples) {
        this.replaceAll(examples, 'name');
    }

    onDocString(docString) {
        this.replaceAll(docString, 'content');
    }

    onDataTable(dataTable) {
        dataTable.rows.forEach(row => {
            this.replaceInTableRow(row);
        })
    }

    onExampleRow (exampleRow) {
        this.replaceInTableRow(exampleRow);
    }

    onExampleHeader (exampleHeader) {
        this.replaceInTableRow(exampleHeader);
    }
}

module.exports = Replacer;