'use strict';
import fs from "fs-extra";
import assembler from "gherkin-assembler";
import {Parser} from "gherkin";
import {AssemblerConfig, GherkinDocument} from 'gherkin-ast';
import {DefaultConfig} from "./DefaultConfig";
import {PreCompiler} from "./PreCompiler";

export class API {
    private DefaultConfig: DefaultConfig = new DefaultConfig();

    /**
     * Loads the given feature file to a GherkinDocument.
     *
     * @param {string} pathToFile Path to feature file.
     * @returns {GherkinDocument}
     */
    load:GherkinDocument = (pathToFile:string) => {
        const parser = new Parser();
        const document = parser.parse(fs.readFileSync(pathToFile, 'utf8'));
        return assembler.objectToAST(document);
    };

    /**
     * Applies the given pre-compilers to the given AST.
     *
     * @param {GherkinDocument} ast
     * @param {...DefaultConfig|Object} configs
     * @returns {GherkinDocument}
     */
    process:GherkinDocument = (ast:GherkinDocument, ...configs:(DefaultConfig | Object)[]) => {
        configs.forEach(config => {
            const compiler = new PreCompiler(config);
            ast = compiler.applyToAST(ast);
        });
        return ast;
    };

    /**
     * Saves the given AST to a file.
     *
     * @param {string} pathToFile
     * @param {GherkinDocument} ast
     * @param {AssemblerConfig|Object} [options]
     */
    save:object = (pathToFile:string, ast:GherkinDocument, options:AssemblerConfig|Object) => {
        fs.writeFileSync(pathToFile, this.format(ast, options), 'utf8');
    };

    /**
     * Formats the given Gherkin Document to text.
     *
     * @param {GherkinDocument|Array<GherkinDocument>} document
     * @param {AssemblerConfig|Object} [options]
     * @returns {string|Array<string>}
     */
    format = assembler.format;
}
