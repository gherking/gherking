'use strict';
const path = require('path');
const ForLoop = require(path.resolve('lib/builtIn/ForLoop.js'));
const expect = require('chai').expect;
const API = require(path.resolve('lib'));
const sinon = require('sinon');


describe.only('builtIn.ForLoop', () => {
    describe('configuration', () => {
        it('should use default config when no configuration is provided');
        it('should use the provided configutation if available');
        it('should set regex based on the provided value');
    });
    describe('getIterationNumber', () => {
        it('should return 0 when there is no loop tag');
        it('should throw an error when provided iterator exceeds maximum');
        it('should return the correct iterator');
    });
    describe('looper', () => {
        it('should not repeat scenarios without loop tag', () => {
            const loop = new ForLoop();
            loop.getIterationNumber = sinon.stub().returns(0);
            expect(loop.looper(42)).to.be.undefined;
            expect(loop.getIterationNumber.calledWith(42)).to.be.true;
        });
        it('should repeat scenarios for the correct times');
        it('should process scenario names');
    });
    it('should process scenarios', () => {
        const loop = new ForLoop();
        loop.looper = sinon.spy();
        loop.onScenario(42);
        expect(loop.looper.calledWith(42)).to.be.true;
    });
    it('should process scenario outlines', () => {
        const loop = new ForLoop();
        loop.looper = sinon.spy();
        loop.onScenarioOutline(42);
        expect(loop.looper.calledWith(42)).to.be.true;
    });
    it('should filter out loop tags');
    it('should not filter out non loop tags');
    it('should work with feature files');
    it('should be available through API', () => {
        expect(API.builtIn.ForLoop).to.equal(ForLoop);
    });
});