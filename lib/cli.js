'use strict';

const {resolve, join, dirname} = require('path');
const {readFileSync, statSync} = require('fs');
const args = require('yargs')
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
    .check(argv => {
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
        }
        if (!argv.destination) {
            argv.destination = join(argv.base, 'dist');
        } else if (!statSync(argv.destination).isDirectory()) {
            throw new Error('Destination must be a directory!');
        }
        if (!argv.compilers) {
            throw new Error(`Precompilers must be set in the configuration file!\nE.g:\n${JSON.stringify({
                compilers: [{
                    type: "Replacer",
                    arguments: [{
                        user: "ExampleUser"
                    }]
                }]
            }, null, 2)}`);
        } else if (!Array.isArray(argv.compilers)) {
            argv.compilers = [argv.compilers];
        }
        return true;
    })
    .help('help')
    .argv;

module.exports.run = () => {
    console.log(JSON.stringify(args, null, 2));
};