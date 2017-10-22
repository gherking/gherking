'use strict';

const { exec } = require('child_process');
const expect = require('chai').expect;
const cli = require('../lib/cli');
const fail = e => expect(e).to.be.undefined;

const run = (...args) => new Promise((resolve, reject) => {
    process.argv = ['node', 'bin/precompile.js'].concat(args);
    try {
        cli.run();
        resolve();
    } catch (e) {
        reject(e);
    }
});

describe('CLI', function () {
    this.timeout(12e3);

    it.only('should throw error if no configuration file provided', () => {
        return run().then(fail, e => {
            expect(e.message).to.contain('.json');
        });
    });

    it('should throw error if no source of base path set', () => {
        return run(
            '--config test/data/config/cli/ok.json'
        ).then(fail, e => {
            expect(e).to.contain('source or base');
        });
    });

    it('should throw error if source is a pattern and base is not set', () => {
        return run(
            '--config test/data/config/cli/ok.json',
            '--source lib/**/ *.feature'
        ).then(fail, e => {
            expect(e).to.contain('Base must be set');
        });
    });

    it('should throw error if base is a pattern', () => {
        return run(
            '--config test/data/config/cli/ok.json',
            '--base lib/**/*.feature'
        ).then(fail, e => {
            expect(e).to.contain('not a glob pattern');
        });
    });

    it('should throw error if base does not exist', () => {
        return run(
            '--config test/data/config/cli/ok.json',
            '--base lib-it'
        ).then(fail, e => {
            expect(e).to.contain('ENOENT');
        });
    });

    it('should throw error if base is not a directory', () => {
        return run(
            '--config test/data/config/cli/ok.json',
            '--base test/data/config/cli/ok.json'
        ).then(fail, e => {
            expect(e).to.contain('Base must be a directory');
        });
    });

    it('should throw error if destination is not a directory', () => {
        return run(
            '--config test/data/config/cli/ok.json',
            '--source lib',
            '--destination test/data/config/cli/ok.json'
        ).then(fail, e => {
            expect(e).to.contain('Destination must be a directory');
        });
    });

    it('should throw error if compilers is not defined', () => {
        return run(
            '--config test/data/config/cli/empty.json',
            '--base lib'
        ).then(fail, e => {
            expect(e).to.contain('Precompilers');
        });
    });

    it('should throw error if compiler is defined without any path or type', () => {
        return run(
            '--config test/data/config/cli/wrong-compiler.json',
            '--base lib'
        ).then(fail, e => {
            expect(e).to.contain('Type or path of');
        });
    });

    it('should throw error if compiler is defined with wrong type', () => {
        return run(
            '--config test/data/config/cli/wrong-type.json',
            '--base lib'
        ).then(fail, e => {
            expect(e).to.contain('There is no such precompiler');
        });
    });

    it('should throw error if compiler is defined with wrong path', () => {
        return run(
            '--config test/data/config/cli/wrong-path.json',
            '--base lib'
        ).then(fail, e => {
            expect(e).to.contain('Path must be a JS or JSON file');
        });
    });

    it('should set missing configurations if only source directory provided', () => {
        return run(
            '--config test/data/config/cli/no-compiler.json',
            '--source test/data/config',
            '--debug'
        ).then(output => {
            expect(output).to.match(/source.*config[\\\/]+\*\*[\\\/]+\*\.feature"/);
            expect(output).to.match(/base.*config"/);
            expect(output).to.match(/destination.*config[\\\/]+dist"/);
        }, fail);
    });

    it('should set missing configurations if only base directory provided', () => {
        return run(
            '--config test/data/config/cli/no-compiler.json',
            '--base test/data/config',
            '--debug'
        ).then(output => {
            expect(output).to.match(/source.*config[\\\/]+\*\*[\\\/]+\*\.feature"/);
            expect(output).to.match(/base.*config"/);
            expect(output).to.match(/destination.*config[\\\/]+dist"/);
        }, fail);
    })
});