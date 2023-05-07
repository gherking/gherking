import type {Argv} from "yargs";
import {dirname, join, normalize, resolve} from "path";
import * as fs from "fs";
import {FormatOptions} from "gherkin-io";
import {hasMagic, sync} from "glob";
import {getDebugger} from "../../debug";
import {PreCompiler} from "../../PreCompiler";
import {Document} from "gherkin-ast";
import {load, process as processAst, save} from "../../index";

const debug = getDebugger("cli:precompile");

export const command = "$0";
export const description = "Precompile the feature files";

interface CompilerConfig {
    path?: string;
    configuration?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [name: string]: any;
    }
}

interface IOConfig {
    input: string;
    output: string;
}

export interface CLIConfig {
    config?: string;
    source?: string;
    base?: string;
    destination?: string;
    verbose?: boolean;
    clean?: boolean;
}

interface Config extends CLIConfig {
    compilers: CompilerConfig[];
    formatOptions?: FormatOptions;
}

const isPackage = (name: string): boolean => {
    try {
        require(name);
        return true;
    } catch (e) {
        return false;
    }
}

const isDirectory = (path: string): boolean => {
    try {
        return fs.statSync(path).isDirectory();
    } catch (e) {
        return false;
    }
}

const isFile = (path: string): boolean => {
    try {
        return fs.statSync(path).isFile();
    } catch (e) {
        return false;
    }
}

const prepareConfig = (argv: Config): Config => {
    debug("prepareConfig %o", argv);
    if (!fs.existsSync(argv.config)) {
        throw new Error(`Configuration file does not exist: ${argv.config}!`);
    }
    if (!argv.source && !argv.base) {
        throw new Error("Either source of base option must be set!");
    }
    if (!argv.base) {
        if (hasMagic(argv.source)) {
            throw new Error("Base must be set in case of source is a pattern!");
        }
        if (isDirectory(argv.source)) {
            argv.base = argv.source;
        } else {
            argv.base = dirname(argv.source);
        }
    } else {
        if (hasMagic(argv.base)) {
            throw new Error("Base must be a directory, not a glob pattern!");
        }
        if (!isDirectory(argv.base)) {
            throw new Error("Base must be a directory!");
        }
    }
    if (!argv.source) {
        argv.source = join(argv.base, "**", "*.feature");
    } else if (!hasMagic(argv.source) && isDirectory(argv.source)) {
        argv.source = join(argv.source, "**", "*.feature");
    }
    if (!argv.destination) {
        argv.destination = join(argv.base, "dist");
    } else if (!isDirectory(argv.destination)) {
        if (fs.existsSync(argv.destination)) {
            throw new Error("Destination must be a directory!");
        }
        fs.mkdirSync(argv.destination);
    }
    if (!Array.isArray(argv.compilers)) {
        throw new Error("Precompilers must be set in the configuration file!");
    } else {
        argv.compilers.forEach(config => {
            if (!config.path) {
                throw new Error("Package or path of the precompiler must be set!");
            }
            if (!isPackage(config.path) && !isFile(config.path)) {
                throw new Error(`Path must be either a NPM package name or a JS file: ${config.path}!`);
            }
        })
    }
    if (argv.verbose) {
        console.log("Configuration:", JSON.stringify(argv, null, 2));
    }
    return argv;
}

const resolvePath = (path: string): string => path ? resolve(path) : null;

export function builder(yargs: Argv) {
    return yargs
        .option("config", {
            type: "string",
            alias: "c",
            coerce: resolvePath,
            default: "./.gherking.json",
            description: "The path of the configuration file which contains the precompilers and their configurations.",
            normalize: true,
            config: true,
            configParser: (path: string) => require(path)
        })
        .option("source", {
            type: "string",
            alias: "s",
            coerce: resolvePath,
            description: "The pattern or path of feature files which needs to be precompiled.",
            normalize: true
        })
        .option("base", {
            type: "string",
            alias: "b",
            coerce: resolvePath,
            description: "The base directory of feature files.",
            normalize: true
        })
        .option("destination", {
            type: "string",
            alias: "d",
            coerce: resolvePath,
            description: "The destination directory of precompiled feature files.",
            normalize: true
        })
        .option("verbose", {
            type: "boolean",
        })
        .option("clean", {
            type: "boolean",
            description: "Whether the destination directory should be clean in advance.",
        })
        .help("help")
        .fail((msg: string, err: Error, ya: Argv) => {
            console.error(msg);
            console.error(ya.help())
            if (err) throw err;
        });
}

const loadCompilers = (compilers: CompilerConfig[]): PreCompiler[] => {
    return compilers.map(compiler => {
        let preCompiler;
        if (isPackage(compiler.path)) {
            preCompiler = require(compiler.path);
        } else {
            preCompiler = require(resolve(compiler.path));
        }
        if (typeof preCompiler === "function") {
            return new preCompiler(compiler.configuration || {});
        }
        if (typeof preCompiler !== "object") {
            throw new Error(`Precompiler (${compiler.path}) must be a class or a PreCompiler object: ${preCompiler}!`);
        }
        if (typeof preCompiler.default === "function") {
            return new preCompiler.default(compiler.configuration || {});
        }
        if (typeof preCompiler.default === "object") {
            return preCompiler.default;
        }
        return preCompiler;
    });
};

const processSource = async (source: IOConfig, compilers: PreCompiler[], formatOptions: FormatOptions): Promise<void> => {
    const outputDir = dirname(source.output);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const documents: Document[] = await load(source.input);
    const document = documents[0];
    document.targetFolder = outputDir;
    const outputAst = processAst(document, ...compilers);
    await save(source.output, outputAst, formatOptions);
}

const getSources = (config: Config): IOConfig[] => {
    return sync(config.source, { absolute: true })
        .map(normalize)
        .map(file => ({
            input: file,
            output: config.destination + file.replace(config.base, ""),
        }));
}

export async function handler(argv: Config): Promise<void> {
    debug("run");
    const config = prepareConfig(argv);
    debug("...config: %o", config);

    const compilers = loadCompilers(config.compilers);
    debug("...compilers: %o", compilers);

    const sources = getSources(config);
    debug("...sources: %o", sources);

    if (config.clean && fs.existsSync(config.destination)) {
        config.verbose && console.log(`Cleaning ${config.destination}`);
        (fs.rmSync ? fs.rmSync : fs.rmdirSync)(config.destination, { recursive: true });
        fs.mkdirSync(config.destination, { recursive: true });
    }

    for (const source of sources) {
        config.verbose && console.log(`Processing ${source.input}`);
        await processSource(source, compilers, config.formatOptions);
        config.verbose && console.log(`Processed file written out ${source.output}`);
    }
}