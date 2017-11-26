'use strict';
const path = require('path');
const Macro = require(path.resolve('lib/builtIn/Macro.js'));
const expect = require('chai').expect;
const API = require(path.resolve('lib'));
const assembler = require('gherkin-assembler');


describe('builtIn.Macro', () => {
    let macro;
    beforeEach(() => {
        macro = new Macro();
    });
    it('should store macros', () => {
        expect(macro.macros).to.eql({});
    });

    it('should not filter out non macro scenarios', () => {
        const scenario = new assembler.AST.Scenario();
        const tag = new assembler.AST.Tag('@notmacro');

        scenario.tags.push(tag);
        expect(macro.preFilterScenario(scenario)).to.be.undefined;
    });

    it('should throw an error when no name is provided for macro', () => {
        expect(() => {
            const scenario = new assembler.AST.Scenario();
            const tag = new assembler.AST.Tag('@macro()');

            scenario.tags.push(tag);
            macro.preFilterScenario(scenario);
        }).to.throw(Error)

    });

    it('should throw an error when a macro name is already defined', () => {
        expect(() => {
            const scenario = new assembler.AST.Scenario();
            const scenario_2 = new assembler.AST.Scenario();
            const tag = new assembler.AST.Tag('@macro(testname)');

            scenario.tags.push(tag);
            scenario_2.tags.push(tag);

            macro.preFilterScenario(scenario);
            macro.preFilterScenario(scenario_2);
        }).to.throw(Error);
    });

    it('should throw an error when a macro does not contain any steps', () => {
        expect(() => {
            const scenario = new assembler.AST.Scenario();
            const tag = new assembler.AST.Tag('@macro(test)');

            scenario.tags.push(tag);
            macro.preFilterScenario(scenario);
        }).to.throw(Error)
    });

    it('should throw an error when a macro contains a macro step', () => {
        expect(() => {
            const scenario = new assembler.AST.Scenario();
            const tag = new assembler.AST.Tag('@macro(test)');
            const step = new assembler.AST.Step('And', 'macro test is executed');

            scenario.tags.push(tag);
            scenario.steps.push(step);
            macro.preFilterScenario(scenario);
        }).to.throw(Error)
    });

    it('should process macro scenarios');

    it('should not change non macro steps');

    it('should throw an error when name is not provided for macro', () => {
        expect(() => {
            const scenario = new assembler.AST.Scenario();
            const scenario_2 = new assembler.AST.Scenario();
            const tag = new assembler.AST.Tag('@macro(test)');
            const step = new assembler.AST.Step('And', 'macro is executed');

            scenario.tags.push(tag);
            scenario_2.steps.push(step);
            macro.onStep(scenario.steps[1]);
        }).to.throw(Error)
    });

    // it('should throw an error when there is no macro by name provided', () => {
    //     expect(() => {
    //         const scenario = new assembler.AST.Scenario();
    //         const scenario_2 = new assembler.AST.Scenario();
    //         const tag = new assembler.AST.Tag('@macro(test)');
    //         const step = new assembler.AST.Step('And', 'macro test2 is executed');
    //
    //         scenario.tags.push(tag);
    //         scenario_2.steps.push(step);
    //         macro.onStep(scenario_2.steps[0]);
    //     }).to.throw(Error)
    // });

    // it('should process macro steps', () => {
    //     const scenario_macro = new assembler.AST.Scenario();
    //     const scenario_test = new assembler.AST.Scenario();
    //     const tag = new assembler.AST.Tag('@macro(test)');
    //     const step_macro = new assembler.AST.Step('When','test step');
    //     const step_test = new assembler.AST.Step('And', 'macro test is executed');
    //
    //     scenario_macro.tags.push(tag);
    //     scenario_macro.steps.push(step_macro);
    //     scenario_test.steps.push(step_test);
    //
    //     macro.preFilterScenario(scenario_macro);
    //
    //     console.log(macro.onStep(scenario_test.));
    //     expect(macro.onStep(scenario_test.steps[0])).to.eql(scenario_macro.steps);
    // });

});