import * as inquirer from "inquirer";
import fuzzyPath = require("inquirer-fuzzy-path")

// eslint-disable-next-line @typescript-eslint/no-var-requires
const schema = require("../../schema/gherking.schema.json");

inquirer.registerPrompt("fuzzypath", fuzzyPath);

/*
 0. Download the hosted schema
 1. Path of the configuration file, default: .gherking.json
 2. The base folder, where the feature files are (schema.properties.base), default: the one with "features" or CWD
 3. The source features pattern (schema.properties.source), default: BASE/ * * / *.feature
 4. The destination folder, where the feature files put (schema.properties.destination), default: BASE/dist
 5. Should the destination folder be cleaned? (schema.properties.clean), default: false
 6. Should verbose input enabled? (schema.properties.verbose), default: false
 7. Should the missing precompilers be installed? (schema.properties.install), default: false
 8. Which precompilers to use? (schema.definitions.gpc*)
 */

const makeQuestion = (description: string): string => {
    return `Please specify ${description.slice(0, 1).toLowerCase()}${description.slice(1)}`;
}

const excludePath = (nodePath: string) =>
    nodePath.startsWith("node_modules");
const excludeFilter = (nodePath: string) => nodePath.startsWith(".");

const QUESTION_CONFIG_FILE_NAME: inquirer.InputQuestion = {
    type: "input",
    name: "configFileName",
    message: "Please specify the name of GherKing configuration file.",
    default: ".gherking.json",
    validate(input: string) {
        return /\.json$/.test(input);
    },
};
const QUESTION_BASE_PATH: fuzzyPath.FuzzyPathQuestionOptions = {
    type: "fuzzypath",
    name: "baseFolder",
    message: makeQuestion(schema.properties.base.description),
    excludePath,
    excludeFilter,
    default: schema.properties.base.default,
    itemType: "directory",
    rootPath: ".",
    suggestOnly: false,
    depthLimit: 3,
    validate(input: any, answers?: any) {
        console.log({input, answers});
        return true;
    }
};
const QUESTIONS: inquirer.Question[] = [
    QUESTION_CONFIG_FILE_NAME,
    QUESTION_BASE_PATH,
]

export const command = "init";
export const description = "Initializes a GherKing project";

export const builder = {};

export async function handler(argv: any): Promise<void> {
    const answers = await inquirer.prompt(QUESTIONS);
    console.log({argv, answers});
}