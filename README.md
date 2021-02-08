# gherking

![Downloads](https://img.shields.io/npm/dw/gpc-template?style=flat-square)
![Version@npm](https://img.shields.io/npm/v/gpc-template?label=version%40npm&style=flat-square)
![Version@git](https://img.shields.io/github/package-json/v/gherking/gpc-template/master?label=version%40git&style=flat-square)
![CI](https://img.shields.io/github/workflow/status/gherking/gpc-template/CI/master?label=ci&style=flat-square)
![Docs](https://img.shields.io/github/workflow/status/gherking/gpc-template/Docs/master?label=docs&style=flat-square)

Simple pre-compiler for Gherkin feature files.

It is based on the AST what is provided by [gherkin-ast](https://www.npmjs.com/package/gherkin-ast).

## Usage

```javascript
'use strict';
const compiler = require('gherking');
const {Replacer} = require('gpc-replacer');

let ast = compiler.load('./features/src/login.feature');
ast = compiler.process(
    ast,
    new Replacer({
        name: 'Hello'
    })
);
compiler.save('./features/dist/login.feature', ast, {
    lineBreak: '\r\n'
});
```

```typescript
'use strict';
import {load, process, save} from "gherking";
import {Replacer} from "gpc-replacer";

let ast = load("./features/src/login.feature");
ast = process(
    ast,
    new Replacer({
        name: 'Hello'
    })
);
save('./features/dist/login.feature', ast, {
    lineBreak: '\r\n'
});
```

### Pre-compilers

 * [ForLoop](https://www.npmjs.com/package/gpc-for-loop) - Enables the user to loop scenarios and scenario outlines in order to repeat them.
 * [Macro](https://www.npmjs.com/package/gpc-macro) - Enables the user to create and execute macros.
 * [RemoveDuplicates](https://www.npmjs.com/package/gpc-remove-duplicates) - Removes duplicated tags or example data table rows.
 * [Replacer](https://www.npmjs.com/package/gpc-replacer) - Replaces keywords in the feature files.
 * [ScenarioNumbering](https://www.npmjs.com/package/gpc-scenario-numbering) - Adds an index to all scenario and scenario outline's name.
 * [ScenarioOutlineExpander](https://www.npmjs.com/package/gpc-scenario-outline-expander) - Expand the Scenario Outlines to actual scenarios.
 * [ScenarioOutlineNumbering](https://www.npmjs.com/package/gpc-scenario-outline-numbering) - Makes all scenario, generated from scenario outlines unique.
 * [StepGroups](https://www.npmjs.com/package/gpc-step-groups) - Corrects the gherkin keywords of steps to make the tests more readable.

## CLI

The package provides a command line interface to be able to easily precompile feature files.

```bash
# install package globally
npm install -g gherking

# use gherking, precompile or gherkin-precompiler commands
gherking --config precompiler.json --base e2e/features/src --destination e2e/features/dist
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
        // one option is to use precompiler packages,
        {
            // by setting the package
            "package": "gpc-replacer",
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

## API

### `load`

It loads the given feature file to a `GherkinDocument`.

**Params:**

 * `{string} pathToFile` - the path of the feature file which needs to be loaded
 
**Returns:** `{Promise<Document[]>}` the AST of the given feature file

### `save`

Saves the given AST ast feature file to the given path.

**Params:**
 
 * `{string} pathToFile` - the path of the feature file where the AST needs to be saved
 * `{Document|Document[]} ast` - the AST needs to be saved to the file
 * `{FormatterOptions} [options]` - configuration of formatting, see [FormatterConfig](https://github.com/gherking/gherkin-formatter)
 
### `process`

Applies the given pre-compilers to the given AST.

**Params:**

 * `{Document|Document[]} ast` - the AST needs to be processed
 * `{...PreCompiler} pre-compilers` - the pre-compilers needs to be applied to the given AST
 
**Returns:** `{Document[]}` the processed AST

## PreCompiler

If you want to create own pre-compiler, you only have to extends the `Default` class and override the filter and/or event methods, that you want to use; or create and object with the desired methods.

### Event methods

Every element can be modified by using it's correspondent event methods.

All event methods (except `onFeature`) receives the given element, it's parent and - if applicable - the index of the element.
Given that all event receives the given element as an `Object`, those can be easily modified by modifying the object itself.

The following methods are available, to see exact signature of the given method, click on the name of it:

 * [onFeature](src/PreCompiler.ts#L22)<sup>1</sup>
 * [onRule](src/PreCompiler.ts#L23)<sup>1</sup>
 * [onScenario](src/PreCompiler.ts#L24)<sup>1</sup>
 * [onScenarioOutline](src/PreCompiler.ts#L25)<sup>1</sup>
 * [onBackground](src/PreCompiler.ts#L26)
 * [onExamples](src/PreCompiler.ts#L27)<sup>1</sup>
 * [onStep](src/PreCompiler.ts#L28)<sup>1</sup>
 * [onTag](src/PreCompiler.ts#L29)<sup>1</sup>
 * [onDocString](src/PreCompiler.ts#L30)
 * [onDataTable](src/PreCompiler.ts#L31)
 * [onTableRow](src/PreCompiler.ts#L32)<sup>1</sup>

If the method returns
 * `null`, then the given element will be deleted
 * an element, then the original element will be replaced with the returned one
 * (only for <sup>1</sup>) an element array, in case of event which process list element (i.e. tag, scenario, examples, step, background, scenario outline), then the original element will be replaced with the returned list
 * nothing, the element won't be replaced

### Filter methods

Every element (both single and list) in the AST can be filtered by using it's correspondent pre- or post filter methods.
A pre filter methods is applied before the processing of the event, the post applied after it.

All filter methods receives the given element, it's parent and - if applicable - the index of the element.
If a filter method is set, the metod **must** return `true` if the element should be kept, otherwise the element will be discarded. If a filter method is not set, no filtering will happen on the given type of element.

The following methods are available, to see exact signature of the given method, click on the name of it:

 * [preFeature](src/PreCompiler.ts#L34), [postFeature](src/PreCompiler.ts#L35)
 * [preRule](src/PreCompiler.ts#L36), [postRule](src/PreCompiler.ts#L37)
 * [preScenario](src/PreCompiler.ts#L38), [postScenario](src/PreCompiler.ts#L39)
 * [preScenarioOutline](src/PreCompiler.ts#L40), [postScenarioOutline](src/PreCompiler.ts#L41)
 * [preBackground](src/PreCompiler.ts#L42), [postBackground](src/PreCompiler.ts#L43)
 * [preExamples](src/PreCompiler.ts#L44), [postExamples](src/PreCompiler.ts#L45)
 * [preStep](src/PreCompiler.ts#L46), [postStep](src/PreCompiler.ts#L47)
 * [preTag](src/PreCompiler.ts#L48), [postTag](src/PreCompiler.ts#L49)
 * [preDocString](src/PreCompiler.ts#L50), [postDocString](src/PreCompiler.ts#L51)
 * [preDataTable](src/PreCompiler.ts#L52), [postDataTable](src/PreCompiler.ts#L53)
 * [preTableRow](src/PreCompiler.ts#L54), [postTableRow](src/PreCompiler.ts#L55)
