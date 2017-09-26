'use strict';

const fs = require('fs');
const path = require('path');
const plugin = require(path.resolve('gulp'));
const Replacer = require(path.resolve('lib/builtIn/Replacer'));
const CONFIG = require('./data/replacer.json');
const File = require('vinyl');

const expect = require('chai').expect;

describe('Gulp plugin', () => {
    it('should throw error if no precompiler passed', () => {
        expect(() => plugin()).to.throw;
    });

    describe('buffered input', () => {
        let file, check, replacer;

        beforeEach(() => {
            file = new File({
                path: 'test/data/test_input_replacer.feature',
                contents: fs.readFileSync('test/data/test_input_replacer.feature') 
            });

            check = (stream, done, cb) => {
                stream.on('data', newFile => {
                    cb(newFile);
                    done();
                });
                stream.write(file);
                stream.end();
            };

            replacer = new Replacer(CONFIG);
        });

        it('should apply replacer to feature file', done => {
            const stream = plugin(replacer);
            check(stream, done, newFile => {
                expect(String(newFile.contents)).to.equal(fs.readFileSync('test/data/test_output_replacer.feature', 'utf8'));
            });
        });
    });
});