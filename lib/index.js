'use strict';

const fs = require('fs-extra');
const assembler = require('gherkin-assembler');
const {Parser} = require('gherkin');
const API = {};

const PreProcessor = require('./PreProcessor');
API.PreProcessor = PreProcessor;

/**
 * Loads the given feature file to a GherkinDocument.
 *
 * @param {string} pathToFile Path to feature file.
 * @returns {GherkinDocument}
 */
API.load = pathToFile => {
    const parser = new Parser();
    const document = parser.parse(fs.readFileSync(pathToFile, 'utf8'));
    return assembler.objectToAST(document);
};

/**
 * Applies the given preprocessors to the given AST.
 *
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
 *
 * @param {GherkinDocument|Array<GherkinDocument>} document
 * @param {AssemblerConfig|Object} [options]
 * @returns {string|Array<string>}
 */
API.format = assembler.format;

/**
 * Saves the given AST to a file.
 *
 * @param {string} pathToFile
 * @param {GherkinDocument} ast
 * @param {AssemblerConfig|Object} [options]
 */
API.save = (pathToFile, ast, options) => {
    fs.writeFileSync(pathToFile, API.format(ast, options), 'utf8');
};

/**
 * Built-in pre-processors.
 * @type {Object.<String,PreProcessor>}
 */
API.builtIn = {};
// TODO: define built-in pre-processors

module.exports = API;