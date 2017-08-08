'use strict';

const path = require('path');
const API = require(path.resolve('lib/index.js'));
const assembler = require('gherkin-assembler');

const expect = require('chai').expect;

describe('API', () => {
    let ast;

    before(() => {
        ast = API.load(path.resolve('test/data/base.feature'));
    });

    describe('.load()', () => {
        it('should load a GherkinDocument', () => {
            expect(ast).to.be.instanceOf(assembler.AST.GherkinDocument);
        });
    });
});