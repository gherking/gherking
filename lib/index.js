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

const PreCompiler = require('./PreCompiler');
/**
 * Applies the given pre-compilers to the given AST.
 *
 * @param {GherkinDocument} ast
 * @param {...DefaultConfig|Object} configs
 * @returns {GherkinDocument}
 */
API.process = (ast, ...configs) => {
    configs.forEach(config => {
        const compiler = new PreCompiler(config);
        ast = compiler.applyToAST(ast);
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
 * Built-in pre-compilers.
 * @type {Object.<String,PreCompiler>}
 */
API.builtIn = {};
API.builtIn.ForLoop = require('./builtIn/ForLoop');
API.builtIn.Macro = require('./builtIn/Macro');
API.builtIn.RemoveDuplicates = require('./builtIn/RemoveDuplicates');
API.builtIn.Replacer = require('./builtIn/Replacer');
API.builtIn.ScenarioNumbering = require('./builtIn/ScenarioNumbering');
API.builtIn.ScenarioOutlineExpander = require('./builtIn/ScenarioOutlineExpander');
API.builtIn.ScenarioOutlineNumbering = require('./builtIn/ScenarioOutlineNumbering');
API.builtIn.StepGroups = require('./builtIn/StepGroups');

module.exports = API;