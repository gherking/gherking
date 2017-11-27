'use strict';
const path = require('path');
const ForLoop = require(path.resolve('lib/builtIn/ForLoop.js'));
const expect = require('chai').expect;
//const CONFIG = require('../data/config/ForLoop.json');
const API = require(path.resolve('lib'));


describe('builtIn.ForLoop', () => {
    // it('should not change scenarios without loop tag');
    // it('should process scenarios with loop tag');
    // // it('should throw error if no/wrong configuration is passed', () => {
    // //     expect(() => {
    // //         new ForLoop();
    // //     }).to.throw(TypeError);
    // // });
    // it('should throw an error when there is no iterator given in the loop tag', () => {
    //     expect(() => {
    //         const scenario = new assembler.AST.Scenario();
    //         const tag = new assembler.AST.Tag('@loop()');
    //         scenario.tags.push(tag);
    //
    //         forLoop.preFilterScenario(scenario);
    //     }).to.throw(Error)
    // });
    // it('should throw an error when invalid iterator is given in the loop tag', () => {
    //     expect(() => {
    //         const scenario = new assembler.AST.Scenario();
    //         const tag = new assembler.AST.Tag('@loop(invalid)');
    //         scenario.tags.push(tag);
    //
    //         forLoop.preFilterScenario(scenario);
    //     }).to.throw(Error)
    // });

});