'use strict';

const fs = require('fs-extra');
const assembler = require('gherkin-assembler');
const {Parser} = require('gherkin');
const API = {};

const DefaultConfig = require('./DefaultConfig');
API.DefaultConfig = DefaultConfig;

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

const PreProcessor = require('./PreProcessor');
/**
 * Applies the given pre-processors to the given AST.
 *
 * @param {GherkinDocument} ast
 * @param {...DefaultConfig|Object} configs
 * @returns {GherkinDocument}
 */
API.process = (ast, ...configs) => {
    configs.forEach(config => {
        const processor = new PreProcessor(config);
        ast = processor.applyToAST(ast);
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