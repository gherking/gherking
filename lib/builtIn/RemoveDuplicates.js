'use strict';

const DefaultConfig = require('../DefaultConfig');
const {Tag} = require('gherkin-assembler').AST;
const ObjectSet = require('object-set-type');

/**
 * @typedef {Object} RemoveDuplicatesConfiguration
 * @property {boolean} processTags
 * @property {boolean} processRows
 * @property {boolean} verbose
 */
const DEFAULT_CONFIG = {
    processTags: true,
    processRows: false,
    verbose: true
};

const removeDuplicates = array => Array.from(new Set(array));

class RemoveDuplicates extends DefaultConfig {
    constructor(config) {
        super();
        this.config = Object.assign({}, DEFAULT_CONFIG, config || {});

        this.logTag = this._getLogger(this.config.processTags);
        this.logRow = this._getLogger(this.config.processRows);
    }

    _getLogger(enabled) {
        return this.config.verbose ? (...args) => console[enabled ? 'log' : 'warn'].apply(console, args) : () => null;
    }

    _hasTag(element, tagName) {
        if (!element.tags || !element.tags.length) {
            return false;
        }
        return element.tags.some(tag => tag.name === tagName);
    }

    _filterTags(element, parent) {
        if (element.tags && element.tags.length) {
            const ownTags = element.tags.filter(tag => {
                if (this._hasTag(parent, tag.name)) {
                    this.logTag(`The ${tag.name} presents on feature too on "${element.keyword} ${element.name}" in "${parent.keyword} ${parent.name}"`);
                    return false;
                }
                return true;
            });
            const tagNames = ownTags.map(tag => tag.name);
            const uniqueTagNames = removeDuplicates(tagNames);
            if (tagNames.length !== uniqueTagNames) {
                uniqueTagNames.filter(tag => {
                    return tagNames.reduce((n, name) => n + (name === tag ? 1 : 0), 0) > 1;
                }).forEach(tag => {
                    this.logTag(`The ${tag} presents multiple times on "${element.keyword} ${element.name}" in "${parent.keyword} ${parent.name}"`);
                });
            }
            if (this.config.processTags) {
                element.tags = uniqueTagNames.map(tag => new Tag(tag));
            }
        }
    }

    _filterRows(element) {
        if (element.body && element.body.length) {
            element.body = Array.from(new ObjectSet(element.body));
        }
    }

    onScenario(scenario, parent) {
        this._filterTags(scenario, parent);
    }

    onScenarioOutline(scenarioOutline, parent) {
        this._filterTags(scenarioOutline, parent);
        if (scenarioOutline.examples) {
            scenarioOutline.examples.forEach(examples => {
                this._filterTags(examples, parent);
                this._filterRows(examples);
            });
        }
    }
}

module.exports = RemoveDuplicates;