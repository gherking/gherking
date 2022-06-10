import inquirer = require("inquirer")
import fuzzyPath = require("inquirer-fuzzy-path")
import { Precompilers } from "./precomplierList"

inquirer.registerPrompt('fuzzypath', fuzzyPath)

const configQuestion: inquirer.InputQuestion = {
    type: "input",
    name: "configName",
    message: "Give the path of the configuration file which contains the precompilers and their configurations:",
    default: "./.gherking.json",
}

const sourceQuestion: fuzzyPath.FuzzyPathQuestionOptions = {
    type: "fuzzypath",
    name: "sourcePath",
    excludePath: (nodePath: string) => nodePath.startsWith("node_modules"),
    itemType: "any",
    rootPath: "./",
    message: "Give the pattern or path of feature files that need to be precompiled:",
    suggestOnly: true,
    depthLimit: 5,
};

const baseQuestion: fuzzyPath.FuzzyPathQuestionOptions = {
    type: "fuzzypath",
    name: "basePath",
    excludePath: (nodePath: string) => nodePath.startsWith("node_modules"),
    itemType: "directory",
    rootPath: "./",
    message: "Give the base directory of feature files:",
    suggestOnly: true,
    depthLimit: 5,
};

const destinationQuestion: fuzzyPath.FuzzyPathQuestionOptions = {
    type: "fuzzypath",
    name: "destinationPath",
    excludePath: (nodePath: string) => nodePath.startsWith("node_modules"),
    itemType: "directory",
    rootPath: "./",
    message: "Give the destination directory of precompiled feature files:",
    suggestOnly: true,
    depthLimit: 5,
};

const precompilerQuestion: inquirer.ListQuestion = {
    type: "list",
    name: "precompilers",
    message: "Select the precompilers you want to use:",
    choices: [
        Precompilers.FILTER, 
        Precompilers.FOR_LOOP, 
        Precompilers.MACRO, 
        Precompilers.REMOVE_COMMENTS, 
        Precompilers.REMOVE_DUPLICATES, 
        Precompilers.REPLACER, 
        Precompilers.SCENARIO_NUMBERING,
        Precompilers.SCENARIO_OUTLINE_EXPANDER, 
        Precompilers.SCENARIO_OUTLINE_NUMBERING,
        Precompilers.STEP_GROUPS,
        Precompilers.TEST_DATA
    ]
}

const formatQuestion1: inquirer.ConfirmQuestion = {
    type: "confirm",
    name: "oneTagPerLine",
    message: "Should the tags be rendered separately, one by line?",
    default: false
}

const formatQuestion2: inquirer.ConfirmQuestion = {
    type: "confirm",
    name: "separateStepGroups",
    message: "Should step groups (when-then) be separated?",
    default: false
}

const formatQuestion3: inquirer.ConfirmQuestion = {
    type: "confirm",
    name: "compact",
    message: "Should empty lines be skipped, removed from the result?",
    default: false
}

const formatQuestion4: inquirer.InputQuestion = {
    type: "input",
    name: "lineBreak",
    message: "Give the line break character(s) (in case it is not given, it will be determined by the platform):",
    default: null
}

const formatQuestion5: inquirer.InputQuestion = {
    type: "input",
    name: "indentation",
    message: "Give the indentation character(s) (default is two space characters):",
    default: "  "
}
