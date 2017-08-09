# gherkin-preprocessor

[![Build Status](https://travis-ci.org/szikszail/gherkin-preprocessor.svg?branch=master)](https://travis-ci.org/szikszail/gherkin-preprocessor) [![dependency Status](https://david-dm.org/szikszail/gherkin-pre-processor.svg)](https://david-dm.org/szikszail/gherkin-pre-processor) [![devDependency Status](https://david-dm.org/szikszail/gherkin-pre-processor/dev-status.svg)](https://david-dm.org/szikszail/gherkin-pre-processor#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/szikszail/gherkin-pre-processor/badge.svg?branch=master)](https://coveralls.io/github/szikszail/gherkin-pre-processor?branch=master)

Simple pre-processor for Gherkin feature files.

It is based on the AST what is provided by [gherkin-assembler](https://www.npmjs.com/package/gherkin-assembler).

## Usage

```javascript
'use strict';
const processor = require('gherkin-pre-processor');

let ast = processor.load('./features/src/login.feature');
ast = processor.process(
    ast,
    new processor.builtIn.Replacer({
        name: 'Hello'
    })
);
processor.save('./features/dist/login.feature', ast, {
    lineBreak: '\r\n'
});
```

### Built-in pre processors

 * [Replacer](lib/builtIn/Replacer.md) *TBD*

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
 * `{AssemblerConfig} [options]` - configuration of formatting, see [AssemblerConfig](https://github.com/szikszail/gherkin-assembler)
 
### `process`

Applies the given pre-processors to the given AST.

**Params:**

 * `{GherkinDocument} ast` - the AST needs to be processed
 * `{...PreProcessor} pre-processors` - the pre-processors needs to be applied to the given AST
 
**Returns:** `{GherkinDocument}` the processed AST

### `format`

Formats the given `GherkinDocument` to text.
*Equivalent of gherkin-assembler's `format` method. See API [here](https://github.com/szikszail/gherkin-assembler).*

### `PreProcessor`

Base class to create Gherkin feature file pre-processors.

If you want to create own pre-processor, you only have to extends the `PreProcessor` class and override the filter and/or event methods, that you want to use.

#### Event methods

Every element can be modified by using it's correspondent event methods.

All event methods (except `onFeature`) receives the given element, it's parent and - if applicable - the index of the element.
Given that all event receives the given element as an `Object`, those can be easily modified by modifying the object itself.

The following methods are available, to see exact signature of the given method, click on the name of it:

 * [onFeature](lib/PreProcessor.js#13)
 * [onScenario](lib/PreProcessor.js#24)
 * [onBackground](lib/PreProcessor.js#35)
 * [onScenarioOutline](lib/PreProcessor.js#46) 
 * [onStep](lib/PreProcessor.js#57)
 * [onTag](lib/PreProcessor.js#68)
 * [onDocString](lib/PreProcessor.js#78)
 * [onDataTable](lib/PreProcessor.js#88) 
 * [onExamples](lib/PreProcessor.js#99) 
 * [onExampleHeader](lib/PreProcessor.js#109) 
 * [onExampleRow](lib/PreProcessor.js#120)
 
#### Filter methods

Every element list in the AST can be filtered by using it's correspondent pre- or post filter methods.
A pre filter methods is applied before the processing of the event, the post applied after it.

All filter methods receives the given element, it's parent and the index of the element.
If the methods returns `false` the given element will be excluded from the final list, otherwise not.

The following methods are available, to see exact signature of the given method, click on the name of it:

 * [preFilterScenario](lib/PreProcessor.js#134), [postFilterScenario](lib/PreProcessor.js#148)
 * [preFilterTag](lib/PreProcessor.js#162), [postFilterTag](lib/PreProcessor.js#176)
 * [preFilterStep](lib/PreProcessor.js#190), [postFilterStep](lib/PreProcessor.js#204)
 * [preFilterRow](lib/PreProcessor.js#218), [postFilterRow](lib/PreProcessor.js#232)
 * [preFilterExamples](lib/PreProcessor.js#245), [postFilterExamples](lib/PreProcessor.js#258)
 
#### Applying pre-processor

A pre-processor can be applied to an AST, not just with the `process` method, but separately, using the `applyToAST` method of it.

**Params:**
 
 * `{GherkinDocument} ast` - the AST on which the pre-processor needs to be applied on
 
**Returns:** `{GherkinDocument}` the processed AST