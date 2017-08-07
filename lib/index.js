'use strict';

const fs = require('fs-extra');
const path = require('path');
const assembler = require('gherkin-assembler');
const {Parser} = require('gherkin');
const API = {};

const BUILT_IN_PREPROCESSORS = path.resolve('lib/defaults');

const PreProcessor = require('./PreProcessor');
API.PreProcessor = PreProcessor;

/**
 * Loads the given feature file to a GherkinDocument.
 * @param {string} pathToFile Path to feature file.
 * @returns {GherkinDocument}
 */
API.load = pathToFile => {
    const parser = new Parser();
    const document = parser.parse(fs.readFileSync(pathToFile));
    return assembler.objectToAST(document);
};

/**
 * Applies the given preprocessors to the given AST.
 * @param {GherkinDocument} ast
 * @param {...PreProcessor} preprocessors
 * @returns {GherkinDocument}
 */
API.process = (ast, ...preprocessors) => {
    preprocessors.forEach(preprocessor => {
        ast = preprocessor.applyToAST(ast);
    });
    return ast;
};

/**
 * Formats the given Gherkin Document to text.
 * @param {GherkinDocument|Array<GherkinDocument>} document
 * @param {AssemblerConfig|Object} [options]
 * @returns {string|Array<string>}
 */
API.format = assembler.format;

API.save = (pathToFile, ast, options) => {
    fs.writeFileSync(pathToFile, API.format(ast, options));
};

API.builtIn = {};
fs.readdirSync(BUILT_IN_PREPROCESSORS).forEach(file => {
    const className = file.replace('.js', '');
    Object.defineProperty(API.builtIn, className, {
        value: require(path.join(BUILT_IN_PREPROCESSORS, file)),
        writable: false
    });
});

module.exports = API;