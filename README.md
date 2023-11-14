# gherking

![Downloads](https://img.shields.io/npm/dw/gherking?style=flat-square) ![Version@npm](https://img.shields.io/npm/v/gherking?label=version%40npm&style=flat-square) ![Version@git](https://img.shields.io/github/package-json/v/gherking/gherking/master?label=version%40git&style=flat-square) ![CI](https://img.shields.io/github/actions/workflow/status/gherking/gherking/ci.yml?branch=master&label=ci&style=flat-square) ![Docs](https://img.shields.io/github/actions/workflow/status/gherking/gherking/docs.yml?branch=master&label=docs&style=flat-square)

> **IMPORTANT** The `gherking` package - and the `gpc-*` ones - are placements of the original `gherkin-precompiler` package and are not compatible with any code written in it because of the changed API.

GherKing is a tool to make Gherkin smarter! It allows you to handle Cucumber/Gherkin feature files programmatically in your JavaScript/TypeScript code.

It is based on the AST what is provided by [gherkin-ast](https://www.npmjs.com/package/gherkin-ast)

## Usage

```javascript
const compiler = require('gherking');
const Replacer = require('gpc-replacer');

let ast = await compiler.load('./features/src/login.feature');
ast = await compiler.process(
    ast,
    new Replacer({
        name: 'Hello'
    })
);
await compiler.save('./features/dist/login.feature', ast, {
    lineBreak: '\r\n'
});
```

```typescript
import {load, process, save} from "gherking";
import Replacer = require("gpc-replacer");

let ast = await load("./features/src/login.feature");
ast = await process(
    ast,
    new Replacer({
        name: 'Hello'
    })
);
await save('./features/dist/login.feature', ast, {
    lineBreak: '\r\n'
});
```

### Pre-compilers

Some of our base precompilers:

 * [Filter](https://www.npmjs.com/package/gpc-filter) - Enables the user to filter out scenarios, based on cucumber-tag-expressions.
 * [ForLoop](https://www.npmjs.com/package/gpc-for-loop) - Enables the user to loop scenarios and scenario outlines in order to repeat them.
 * [Macro](https://www.npmjs.com/package/gpc-macro) - Enables the user to create and execute macros.
 * [RemoveDuplicates](https://www.npmjs.com/package/gpc-remove-duplicates) - Removes duplicated tags or example data table rows.
 * [Replacer](https://www.npmjs.com/package/gpc-replacer) - Replaces keywords in the feature files.
 * [ScenarioNumbering](https://www.npmjs.com/package/gpc-scenario-numbering) - Adds an index to all scenario and scenario outline's name.
 * [ScenarioOutlineExpander](https://www.npmjs.com/package/gpc-scenario-outline-expander) - Expand the Scenario Outlines to actual scenarios.
 * [ScenarioOutlineNumbering](https://www.npmjs.com/package/gpc-scenario-outline-numbering) - Makes all scenario, generated from scenario outlines unique.
 * [StepGroups](https://www.npmjs.com/package/gpc-step-groups) - Corrects the gherkin keywords of steps to make the tests more readable.

You can find all our precompilers [in this list](https://github.com/search?q=topic%3Agpc+org%3Agherking&type=Repositories) or on our [home page](https://gherking.github.io/).

## CLI

The package provides a command-line interface to precompile feature files easily.

```bash
# install package globally
npm install -g gherking

# use gherking, precompile or gherkin-precompiler commands
gherking --config .gherking.json --base e2e/features/src --destination e2e/features/dist
```

### Arguments

```shell
Usage: gherking --config <path> [options]

Options:
      --version      Show version number                               [boolean]
  -c, --config       The path of the configuration file which contains the
                     precompilers and their configurations.
                                          [string] [default: "./.gherking.json"]
  -s, --source       The pattern or path of feature files which needs to be
                     precompiled.                                       [string]
  -b, --base         The base directory of feature files.               [string]
  -d, --destination  The destination directory of precompiled feature files.
                                                                        [string]
      --install      Whether the missing precompilers (gpc-* packages) should be
                     installed and save to the package.json. Packages will be
                     installed in the current folder, and package.json created
                     if it is not there yet.          [boolean] [default: false]
      --verbose      Whether some information should be displayed on the screen.
                                                      [boolean] [default: false]
      --clean        Whether the destination directory should be clean in
                     advance.                         [boolean] [default: false]
      --help         Show help                                         [boolean]

```

#### Important

* `config` is a mandatory option since that is the only way to specify the precompilers
* either a **source directory** or **base directory** must be specified either by command line or by configuration
* if one of the location configurations is missing, it is set based on the given other locations, for example
  + if only `base: "e2e/features"` set, then `source` will be `e2e/features/**/*.feature` and `destination` will be `e2e/features/dist`
  + if only `source` directory is set, then `base` will be the source directory,  `destination` will be `{source}/dist` and `source` will be modified to a glob pattern: `{source}/**/*.feature`
* the feature of installing the missing packages relies on the NPM used on the execution platform, thus whether the installed package is added to the package.json or not, depends on it

### Configuration

The configuration **must** contain the precompilers configuration and optionally all options that command-line arguments could specify. It can be a JSON file or a JS file.

> The configuration should be recognized by most of the IDE (as GherKing is added to the [schemastore](http://schemastore.org/)).
>  - IntelliJ Idea, WebStorm, etc: <https://www.jetbrains.com/help/webstorm/json.html#ws_json_using_schemas>
>  - VSCode: use the following plugin: <https://marketplace.visualstudio.com/items?itemName=remcohaszing.schemastore>
> If the schema is not recognized even after that, please update your IDE or add the `$schema` key to the configuration:
> ```js
> // .gherking.json
> {
>    // you can set this schema, so that the IDE will help with the config
>    "$schema": "https://gherking.github.io/gherking/gherking.schema.json",
>   // ...
> }
> ```

```js
// .gherking.json
{
    // compilers should be an array of precompiler configurations
    "compilers": [
        // one option is to use precompiler packages,
        {
            // by setting the package
            "path": "gpc-replacer",
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
    "destination": "e2e/features/dist",
    // Config file can contain parsing options for
    // gherkin-ast, see documentation for more info:
    // https://github.com/gherking/gherkin-ast
    "parseConfig": {
        "tagFormat": "functional"    
    }  
    // Config file can contain formatting options for
    // gherkin-formatter, see documentation for more info:
    // https://github.com/gherking/gherkin-formatter
    "formatOptions": {
        "compact": true,
        "tagFormat": "assignment"
    }
}
```

Note: command line arguments should also support setting `formatOptions` , via object arguments, see [Object@yargs](https://github.com/yargs/yargs/blob/main/docs/tricks.md#objects).

<!--
## API

### `load`

It loads the given feature file to a `GherkinDocument` .

**Params:**

 * `{string} pathToFile` - the path of the feature file which needs to be loaded
 
**Returns:** `{Promise<Document[]>}` the AST of the given feature file

### `save`

Saves the given AST as a feature file to the given path.

**Params:**
 
 * `{string|PathGenerator} pathToFile` - the path of the feature file where the AST needs to be saved, or a function that can generate the path from the AST and the index
 * `{Document|Document[]} ast` - the AST needs to be saved to the file
 * `{FormatterOptions} [options]` - configuration of formatting, see [FormatterConfig](https://github.com/gherking/gherkin-formatter)
 

### `process`

Applies the given precompilers to the given AST.

**Params:**

 * `{Document|Document[]} ast` - the AST needs to be processed
 * `{...PreCompiler} pre-compilers` - the pre-compilers needs to be applied to the given AST
 
**Returns:** `{Promise<Document[]>}` the processed AST
-->

## PreCompiler

If you want to create your precompiler, you only have to extend the `Default` class and override the filter and event methods you want to use; or create an object with the desired methods.

### Event methods

Every element can be modified by using its correspondent event methods.

All event methods (except `onFeature` ) receives the given element, its parent, and - if applicable - the index of the element.
Given that all events receive the given element as an `Object` , they can be easily modified by modifying the object itself.

The following methods are available, to see exact signature of the given method, click on the name of it:

 * [onDocument](src/PreCompiler.ts#L23)
 * [onFeature](src/PreCompiler.ts#L24)<sup>1</sup>
 * [onRule](src/PreCompiler.ts#L25)<sup>1</sup>
 * [onScenario](src/PreCompiler.ts#L26)<sup>1</sup>
 * [onScenarioOutline](src/PreCompiler.ts#L27)<sup>1</sup>
 * [onBackground](src/PreCompiler.ts#L28)
 * [onExamples](src/PreCompiler.ts#L29)<sup>1</sup>
 * [onStep](src/PreCompiler.ts#L30)<sup>1</sup>
 * [onTag](src/PreCompiler.ts#L31)<sup>1</sup>
 * [onDocString](src/PreCompiler.ts#L32)
 * [onDataTable](src/PreCompiler.ts#L33)
 * [onTableRow](src/PreCompiler.ts#L34)<sup>1</sup>

If the method returns
 * `null` , then the given element will be deleted
 * an element, then the original element will be replaced with the returned one
 * (only for <sup>1</sup>) an element array, in case of an event which process list element (i.e., tag, scenario, examples, step, background, scenario outline), then the original element will be replaced with the returned list
 * nothing, the element won't be replaced

### Filter methods

Every element (both single and list) in the AST can be filtered using its correspondent pre- or post filter methods.
A pre-filter method is applied before processing the event; the post is applied after it.

All filter methods receive the given element, its parent, and - if applicable - the element's index.
If a filter method is set, the method **must** return `true` if the element should be kept; otherwise, the element will be discarded. If a filter method is not set, no filtering will happen on the given type of element.

The following methods are available, to see exact signature of the given method, click on the name of it:

 * [preFeature](src/PreCompiler.ts#L36), [postFeature](src/PreCompiler.ts#L37)
 * [preRule](src/PreCompiler.ts#L38), [postRule](src/PreCompiler.ts#L39)
 * [preScenario](src/PreCompiler.ts#L40), [postScenario](src/PreCompiler.ts#L41)
 * [preScenarioOutline](src/PreCompiler.ts#L42), [postScenarioOutline](src/PreCompiler.ts#L43)
 * [preBackground](src/PreCompiler.ts#L44), [postBackground](src/PreCompiler.ts#L45)
 * [preExamples](src/PreCompiler.ts#L46), [postExamples](src/PreCompiler.ts#L47)
 * [preStep](src/PreCompiler.ts#L48), [postStep](src/PreCompiler.ts#L49)
 * [preTag](src/PreCompiler.ts#L50), [postTag](src/PreCompiler.ts#L51)
 * [preDocString](src/PreCompiler.ts#L52), [postDocString](src/PreCompiler.ts#L53)
 * [preDataTable](src/PreCompiler.ts#L54), [postDataTable](src/PreCompiler.ts#L55)
 * [preTableRow](src/PreCompiler.ts#L56), [postTableRow](src/PreCompiler.ts#L57)

### Comments

The semantic comments in the Gerhkin AST do not have their event and filter methods in Gherking because of their various types. You can use the respective owner object methods (e.g., to work with a Feature's comments, use `onFeature` to access them).

## Other

This package uses [debug](https://www.npmjs.com/package/debug) for logging, use `gherking` :

```shell
DEBUG=gherking* gherking ...
```

For detailed documentation see the [TypeDocs documentation](https://gherking.github.io/gherking/).
