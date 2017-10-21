'use strict';

const { resolve, join, dirname, normalize } = require('path');
const { readFileSync, statSync, ensureDirSync } = require('fs-extra');
const glob = require('glob');
const yargs = require('yargs');
const API = require('./index');

const prepareArguments = argv => {
    if (!argv.source && !argv.base) {
        throw new Error('Either source or base option must be set!');
    }
    if (!argv.base) {
        const sourceStat = statSync(argv.source);
        if (sourceStat.isDirectory()) {
            argv.base = argv.source;
        } else if (sourceStat.isFile()) {
            argv.base = dirname(argv.source);
        } else {
            throw new Error('Base must be set!');
        }
    } else if (!statSync(argv.base).isDirectory()) {
        throw new Error('Base must be a directory!');
    }
    if (!argv.source) {
        argv.source = join(argv.base, '**', '*.feature');
    } else if (statSync(argv.source).isDirectory()) {
        argv.source = join(argv.source, '**', '*.feature');
    }
    if (!argv.destination) {
        argv.destination = join(argv.base, 'dist');
    } else if (!statSync(argv.destination).isDirectory()) {
        throw new Error('Destination must be a directory!');
    }
    if (!Array.isArray(argv.compilers) || argv.compilers.length === 0) {
        throw new Error(`Precompilers must be set in the configuration file!\nE.g:\n${JSON.stringify({
            compilers: [{
                type: "Replacer",
                arguments: [{
                    user: "ExampleUser"
                }]
            }]
        }, null, 2)}`);
    } else {
        argv.compilers.forEach(config => {
            if (!config.type && !config.path) {
                throw new Error(`Type or path of the precompiler must be set!\n${JSON.stringify(config, null, 2)}`);
            }
            if (config.type && !API.builtIn[config.type]) {
                throw new Error(`There is no such precompiler: "${config.type}"!`);
            }
            if (config.path && !statSync(config.path).isFile()) {
                throw new Error(`Path must be a JS or JSON file: "${config.path}"!`);
            }
        });
    }
    if (argv.debug) {
        console.log(JSON.stringify(argv, null, 2));
    }
    return true;
};

class CLI {
    constructor() {
        this.config = yargs
            .option('config', {
                type: 'string',
                alias: 'c',
                coerce: resolve,
                default: './precompiler.json',
                description: 'The path of the configuration file which contains the precompilers and their configurations.',
                normalize: true,
                config: true,
                configParser: path => JSON.parse(readFileSync(path, 'utf8'))
            })
            .option('source', {
                type: 'string',
                alias: 's',
                coerce: resolve,
                description: 'The pattern or path of feature files which needs to be precompiled.',
                normalize: true
            })
            .option('base', {
                type: 'string',
                alias: 'b',
                coerce: resolve,
                description: 'The base directory of feature files.',
                normalize: true
            })
            .option('destination', {
                type: 'string',
                alias: 'd',
                coerce: resolve,
                description: 'The destination directory of precompiled feature files.',
                normalize: true
            })
            .option('debug', {
                type: 'boolean'
            })
            .check(prepareArguments)
            .help('help')
            .argv;
        this.compilers = this.getCompilers();
        this.sources = this.getSources();
    }

    getSources() {
        return glob
            .sync(this.config.source, {
                absolute: true
            })
            .map(normalize)
            .map(file => ({
                input: file,
                output: this.config.destination + file.replace(this.config.base, '')
            }));
    }

    getCompilers() {
        return this.config.compilers
            .map(config => {
                if (config.path) {
                    return require(resolve(config.path));
                }
                return new API.builtIn[config.type](config.configuration);
            });
    }

    run() {
        ensureDirSync(this.config.destination);
        this.sources.forEach(source => {
            console.log(`Processing ${source.input}`);
            const ast = API.load(source.input);
            const outputAST = API.process.apply(API, [ast].concat(this.compilers));
            API.save(source.output, outputAST, this.config.formatOptions);
            console.log(`Processed file written our ${source.output}`);
        })    
    }
}   

module.exports.run = () => {
    new CLI().run();
}