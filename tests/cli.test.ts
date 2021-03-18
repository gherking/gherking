import { run, CLIConfig } from "../src/cli";
import { read } from "gherkin-io";

console.error = jest.fn();

describe("CLI", () => {
    let prevArgs: string[];

    beforeEach(() => {
        prevArgs = process.argv;
    });

    afterEach(() => {
        process.argv = prevArgs;
    });

    const runWithArgs = (config: CLIConfig = {}) => {
        config = {
            config: 'tests/cli/data/config.json',
            source: 'tests/cli/data/source/**/*',
            base: 'tests/cli/data/source',
            destination: 'tests/cli/data/destination',
            verbose: true,
            clean: true,
            ...config,
        }
        process.argv = Object.keys(config)
            // @ts-ignore
            .filter(name => config[name] !== null)
            // @ts-ignore
            .map(name => `--${name}=${config[name]}`);
        return run();
    }

    const getResult = (destination = "destination") => read(`tests/cli/data/${destination}/**/*.feature`);

    test("should fail if no config found", async () => {
        await expect(() => runWithArgs({
            config: null,
        })).rejects.toThrow("Configuration file does not exist: /home/laszloszikszai/Work/gherking/precompiler.json!");
    });

    test("should fail if neither base nor source set", async () => {
        await expect(() => runWithArgs({
            base: null,
            source: null,
        })).rejects.toThrow("Either source of base option must be set!");
    });

    test("should fail if no base set and source is a glob", async () => {
        await expect(() => runWithArgs({
            base: null,
            source: "**/*.feature",
        })).rejects.toThrow("Base must be set in case of source is a pattern!");
    });

    test("should fail if base is set as a glob", async () => {
        await expect(() => runWithArgs({
            base: "**/*.feature",
        })).rejects.toThrow("Base must be a directory, not a glob pattern!");
    });

    test("should fail is base is not a folder", async () => {
        await expect(() => runWithArgs({
            base: "tests/cli/data/source/1.feature",
        })).rejects.toThrow("Base must be a directory!");
    });

    test("should fail if destination is not a directory", async () => {
        await expect(() => runWithArgs({
            destination: "tests/cli/data/source/1.feature",
        })).rejects.toThrow("Destination mutst be a directory!");
    });

    test("should fail if compilers not set", async () => {
        await expect(() => runWithArgs({
            config: "tests/cli/data/config-no-compiler.json",
        })).rejects.toThrow("Precompilers must be set in the configuration file!");
    });

    test("should fail if any compiler miss path", async () => {
        await expect(() => runWithArgs({
            config: "tests/cli/data/config-wo-path.json",
        })).rejects.toThrow("Package or path of the precompiler must be set!");
    });

    test("should fail if any compiler is neither a package, not a file", async () => {
        await expect(() => runWithArgs({
            config: "tests/cli/data/config-w-dir-path.json",
        })).rejects.toThrow("Path must be either a NPM package name or a JS file: test/cli/compilers!");
    });

    test("should use source if no base set and source is a directory", async () => {
        await runWithArgs({
            config: "tests/cli/data/config.json"
        });
        const results = await getResult();
        expect(results).toHaveLength(1);
    });

    test.todo("should use dirname of source if no base ser and source if a file");

    test.todo("should set source using base");

    test.todo("should update source if a directory is set");

    test.todo("should set destination if not set based on the base");

    test.todo("should log configuration if verbose set");

    test.todo("should use package as compiler");

    test.todo("should use file as compiler");

    test.todo("should use compiler class");

    test.todo("should use compiler object");

    test.todo("should fail if compiler is neither class nor object");

    test.todo("should clean destination directory if clean is set");
});