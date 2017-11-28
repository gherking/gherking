'use strict';

const DefaultConfig = require('../DefaultConfig');
const DEFAULT_CONFIG = {
    maxValue: 10,
    tagName: 'loop',
    format: '${name} (${i})'
};

/**
 * ForLoop to repeat a scenario for a given number of times.
 * @class
 * @extends DefaultConfig
 */
class ForLoop extends DefaultConfig {
    //TODO: constructor config scenario outline numberingből
    //TODO: on scenario outline ugyanaz mint onscenario
    //TODO: külön függvény getiterationnumber, kap scenariot/outlinet, visszaadja i-t
    //TODO: külön függvény lekéri a számot és ha 0 akkor semmi, ha + akkor ismétli egy tömbben és visszatér és feldolgozza
    //TODO: taget törölni

    constructor(config) {
        super();
        this.config = Object.assign({}, DEFAULT_CONFIG, config || {});
        this._looptag = new RegExp('^@' + this.config.tagName + '\\(\\d+\\)');
    }

    /**
     *
     * @param scenario Scenario that is checked
     * @returns {number} The number of iterations the scenario will be repeated, or 0 if no repeat is necessary
     */
    getIterationNumber(scenario) {
        const iteratorMatch = scenario.tags.find(tag => tag.name.match(this._looptag));
        if (!iteratorMatch) {
            return 0;
        }
        const iterator = +iteratorMatch[1];

        if (iterator > this.config.maxValue) {
            throw new Error('Iterator ${iterator} exceeds maximum value of ${this.config.maIterator}.')
        }
        return iterator;
    }

    looper(scenario) {
        const n = this.getIterationNumber(scenario);
        if (n > 0) {
            const loopedScenarios = [];
            for (let i = 1; i <= n; i++) {
                const actualScenario = scenario.clone();
                actualScenario.name = this.config.format
                    .replace(/\${i}/g, i)
                    .replace(/\${name}/g, actualScenario.name);
                loopedScenarios.push(actualScenario);
            }
            return loopedScenarios;
        }
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
    onScenario(scenario) {
        return this.looper(scenario);
    }

    onScenarioOutline(scenarioOutline) {
        return this.looper(scenarioOutline);
    }

    preFilterTag(tag) {
        if (this.config._looptag.test(tag.name)) {
            return false;
        }
    }
}

module.exports = ForLoop;