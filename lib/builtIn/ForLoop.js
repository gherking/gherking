'use strict';

const DefaultConfig = require('../DefaultConfig');
const LOOPTAG = /^@loop\(.*\)/;

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
    onScenario(scenario, parent, i) {
        //TODO: ha nincs for tag továbblépni
        //TODO: ha van, akkor visszaadni annyiszor az adott scenariot
        //TODO: hibakezelés n-re (negatív, max)

        //
        const iterator = scenario.tags.find(tag => LOOPTAG.test(tag.name));

        if (iterator) {
            if (iterator.length === 0) {
                throw new Error('Iterator missing from tag for scenario ${scenario.name}.');
            }

            if (isNaN(iterator)) {
                throw new Error('Invalid iterator for scenario ${scenario.name}.');
            }

            const name = scenario.name;
            let loopedScenarios =  new Scenario();
            scenario.tags.filter(element => !(LOOPTAG.test(element)));
            for (i = 1; i <= iterator; i++) {
                scenario.name = name + ' (' + i + ')';
                loopedScenarios.push(scenario);
            }
            return loopedScenarios;
        }
    }

}

module.exports = ForLoop;