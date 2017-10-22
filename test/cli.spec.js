'use strict';

const {exec} = require('child_process');
const expect = require('chai').expect;
const fail = e => expect(e).to.be.undefined;

const run = command => new Promise((resolve, reject) => {
    exec(command, {
        cwd: process.cwd()
    }, (error, stdout, stderr) => {
        if (error || stderr) {
            reject(stderr || error);
        } else {
            resolve(stdout);
        }
    })
});

describe('CLI', () => {
    it('should throw error if no configuration file provided',() => {
        return run('node bin/precompile.js').then(fail, e => {
            expect(e).to.contain('.json');
        });
    });

    it('should throw error if no source of base path set', () => {
        return run('node bin/precompile.js --config test/data/config/cli.json').then(fail, e => {
            expect(e).to.contain('source or base');
        });
    });

    it('should throw error if source is a pattern and base is not set', () => {
        return run('node bin/precompile.js --config test/data/config/cli.json --source test/**/*.feature').then(fail, e => {
            expect(e).to.contain('Base must be set');
        });
    });

    it('should throw error if base is a pattern', () => {
        return run('node bin/precompile.js --config test/data/config/cli.json --base test/**/*.feature').then(fail, e => {
            expect(e).to.contain('not a glob pattern');
        });
    });

    it('should throw error if base does not exist', () => {
        return run('node bin/precompile.js --config test/data/config/cli.json --base test-it').then(fail, e => {
            expect(e).to.contain('ENOENT');
        });
    });

    it('should throw error if base is not a directory', () => {
        return run('node bin/precompile.js --config test/data/config/cli.json --base test/data/config/cli.json').then(fail, e => {
            expect(e).to.contain('Base must be a directory');
        });
    });
});