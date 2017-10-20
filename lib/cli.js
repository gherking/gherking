'use strict';

const args = require('yargs')
    .options({
        config: {
            type: 'string',
            alias: 'c',
            description: 'The path of the configuration file which contains the precompilers and their configurations.'
        },
        source: {
            type: 'string',
            alias: 's',
        },
        base: {

        },
        destination: {

        }
    })
    .help('help')
    .argv;

module.exports.run = () => {

};