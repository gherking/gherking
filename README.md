# gherkin-precompiler

[![Build Status](https://travis-ci.org/judit-nahaj/gherkin-precompiler.svg?branch=master)](https://travis-ci.org/judit-nahaj/gherkin-precompiler) [![dependency Status](https://david-dm.org/judit-nahaj/gherkin-precompiler.svg)](https://david-dm.org/judit-nahaj/gherkin-precompiler) [![devDependency Status](https://david-dm.org/judit-nahaj/gherkin-precompiler/dev-status.svg)](https://david-dm.org/judit-nahaj/gherkin-precompiler#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/judit-nahaj/gherkin-precompiler/badge.svg?branch=master)](https://coveralls.io/github/judit-nahaj/gherkin-precompiler?branch=master)

Simple pre-compiler for Gherkin feature files.

It is based on the AST what is provided by [gherkin-assembler](https://www.npmjs.com/package/gherkin-assembler).

## Usage

```javascript
'use strict';
const compiler = require('gherkin-precompiler');

let ast = compiler.load('./features/src/login.feature');
ast = compiler.process(
    ast,
    new compiler.builtIn.Replacer({
        name: 'Hello'
    })
);
compiler.save('./features/dist/login.feature', ast, {
    lineBreak: '\r\n'
});
```

### Built-in pre compilers

 * [Replacer](lib/builtIn/Replacer.md) - Replaces keywords in the feature files.
 * [ScenarioOutlineNumbering](lib/builtIn/ScenarioOutlineNumbering.md) - Makes all scenario, generated from scenario outlines unique.
 * [ScenarioOutlineNumbering](lib/builtIn/Macro.md) - Enables the user to create and execute macros.


## CLI

The package provides a command line interface to be able to easily precompile feature files.

```bash
# install package globally
npm install -g gherkin-precompiler

# use precompile or gherkin-precompiler commands
precompile --config precompiler.json --base e2e/features/src --destination e2e/features/dist
```

### Arguments

| Argument | Description | Example |
|:---------|:------------|:--------|
| `--config`<br>`-c` | **Mandatory**, The location of the configuration which contains the precompiler configuration and could contain all the other configuration options as well. | `precompiler.json` |
| `--source`<br>`-s` | The source glob pattern or a folder path where the source feature files are located. | `e2e/features/src/**/*.feature` |
| `--base`<br>`-b` | The base directory or the feature files/precompile process. The location in the desctination directory of each precompiled feature file is determined by the base directory. | `e2e/features/src` |
| <nobr>`--destination`</nobr><br>`-d` | The destination directory where the precompiled feature files should be stored. | `e2e/features/dist` |
| `--verbose` | If set, precompiler prints out the final configuration and the status of the process. | |
| `--help` | If set, no precompile process is applied, only the usage guidelines are printed out. | |

#### Important

* `config` is a mandatory option, since that is the only way to specify the precompilers
* either a **source directory** or **base directory** must be specified either by command line of by configuration
* if one of the location configurations is missing, it is set based on the given other locations, for example
  * if only `base: "e2e/features"` set, then `source` will be `e2e/features/**/*.feature` and `destination` will be `e2e/features/dist`
  * if only `source` directory is set, then `base` will be the source directory, `destination` will be `{source}/dist` and `source` will be modified to a glob pattern: `{source}/**/*.feature`

### Configuration

The configuration **must** contain the precompilers configuration and optionally all options which could be specified by command line arguments. It can be a JSON file of a JS file

```js
// precompiler.json
{
    // compilers should be an array of precompiler configurations
    "compilers": [
        // one option is to set built-in precompilers,
        {
            // by setting the type of it
            "type": "Replacer",
            // any by setting the configuration which
            // is passed to the constructor
            "configuration": {
                "user": "ta.user1@example.com"
            }
        },
        // other option is to set precompiler object
        {
            // by setting the path to the JS file
            "path": "e2e/utils/myCompiler.js"
        }
    ],
    // source can also be set here
    "source": "e2e/features/src/**/*.feature",
    // base can also be set here
    "base": "e2e/features/src",
    // destination can also be set here
    "destination": "e2e/features/dist"
}
```

## Gulp

```javascript
//gulpfile.js
//...
const gulpCompiler = require('gherkin-precompiler/gulp'); 
const compiler = require('gherkin-precompiler');
const compilers = [
    new compiler.builtIn.Replacer({
        name: 'Hello'
    })
];
const compilerFormat = {
    lineBreak: '\r\n'
};

gulp.task('precompile', () => {
    return gulp.src('./features/**/*.feature')
        .pipe(gulpCompiler(compilers, compilerFormat))
        .pipe(gulp.dest('./dist/features'));
});
```

## API

### `load`

It loads the given feature file to a `GherkinDocument`.

**Params:**

 * `{string} pathToFile` - the path of the feature file which needs to be loaded
 
**Returns:** `{GherkinDocument}` the AST of the given feature file

### `save`

Saves the given AST ast feature file to the given path.

**Params:**
 
 * `{string} pathToFile` - the path of the feature file where the AST needs to be saved
 * `{GherkinDocument} ast` - the AST needs to be saved to the file
 * `{AssemblerConfig} [options]` - configuration of formatting, see [AssemblerConfig](https://github.com/judit-nahaj/gherkin-assembler)
 
### `process`

Applies the given pre-compilers to the given AST.

**Params:**

 * `{GherkinDocument} ast` - the AST needs to be processed
 * `{...DefaultConfig|Object} pre-compilers` - the pre-compilers needs to be applied to the given AST
 
**Returns:** `{GherkinDocument}` the processed AST

### `format`

Formats the given `GherkinDocument` to text.
*Equivalent of gherkin-assembler's `format` method. See API [here](https://github.com/judit-nahaj/gherkin-assembler).*

### Configuration

If you want to create own pre-compiler, you only have to extends the `Default` class and override the filter and/or event methods, that you want to use; or create and object with the desired methods.

#### Event methods

Every element can be modified by using it's correspondent event methods.

All event methods (except `onFeature`) receives the given element, it's parent and - if applicable - the index of the element.
Given that all event receives the given element as an `Object`, those can be easily modified by modifying the object itself.

If you return
 * `null`, then the given element will be deleted
 * an element, then the original element will be replaced with the returned one
 * an element array, in case of event which process list element (i.e. tag, scenario, examples, step, background, scenario outline), then the original element will be replaced with the returned list

The following methods are available, to see exact signature of the given method, click on the name of it:

 * [onFeature](lib/DefaultConfig.js#13)
 * [onScenario](lib/DefaultConfig.js#25)
 * [onBackground](lib/DefaultConfig.js#37)
 * [onScenarioOutline](lib/DefaultConfig.js#49) 
 * [onStep](lib/DefaultConfig.js#61)
 * [onTag](lib/DefaultConfig.js#73)
 * [onDocString](lib/DefaultConfig.js#84)
 * [onDataTable](lib/DefaultConfig.js#95) 
 * [onExamples](lib/DefaultConfig.js#107) 
 * [onExampleHeader](lib/DefaultConfig.js#118) 
 * [onExampleRow](lib/DefaultConfig.js#130)
 
#### Filter methods

Every element list in the AST can be filtered by using it's correspondent pre- or post filter methods.
A pre filter methods is applied before the processing of the event, the post applied after it.

All filter methods receives the given element, it's parent and the index of the element.
If the methods returns `false` the given element will be excluded from the final list, otherwise not.

The following methods are available, to see exact signature of the given method, click on the name of it:

 * [preFilterScenario](lib/DefaultConfig.js#144), [postFilterScenario](lib/DefaultConfig.js#158)
 * [preFilterTag](lib/DefaultConfig.js#172), [postFilterTag](lib/DefaultConfig.js#186)
 * [preFilterStep](lib/DefaultConfig.js#200), [postFilterStep](lib/DefaultConfig.js#214)
 * [preFilterRow](lib/DefaultConfig.js#228), [postFilterRow](lib/DefaultConfig.js#242)
 * [preFilterExamples](lib/DefaultConfig.js#255), [postFilterExamples](lib/DefaultConfig.js#268)
