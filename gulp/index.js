'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;

const PLUGIN_NAME = require('../package.json').name;

const Compiler = require('./compiler');

function preCompiler(configs, formatOptions) {
    if (!configs) {
        throw new PluginError(PLUGIN_NAME, 'Missing pre-compilers!');
    }
    if (!Array.isArray(configs)) {
        configs = [configs];
    }
    const compiler = new Compiler(configs, formatOptions);
    return through.obj((file, enc, cb) => {
        if (file.isNull() || file.isStream()) {
            cb(null, file);
        }
        if (file.isBuffer()) {
            file.contents = compiler.compileBuffer(file.contents);
        }
        //if (file.isStream()) {
        //    file.contents = file.contents.pipe(compiler.stream());
        //}
        cb(null, file);
    });
}

module.exports = preCompiler;