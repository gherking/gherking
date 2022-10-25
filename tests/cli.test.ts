import { run, CLIConfig } from "../src/cli";
import { Document, read } from "gherkin-io";
import * as fs from "fs";
import * as rimraf from "rimraf";
import { pruneID } from "gherkin-ast";
// @ts-ignore
import * as retry from "jest-retries";

jest.mock("lazy-require");

const DEFAULT_RETRY = 5;

const retryTest = (name: string, fn: () => Promise<void>): void => {
    retry(name, DEFAULT_RETRY, fn);
};

describe("CLI", () => {
    let prevArgs: string[];
    const lazyRequire = jest.requireMock("lazy-require");

    beforeEach(() => {
        jest.spyOn(console, "error").mockReturnValue();
        jest.spyOn(console, "log").mockReturnValue();
        prevArgs = process.argv;
    });

    afterEach(() => {
        jest.resetAllMocks();
        process.argv = prevArgs;
    });

    const runWithArgs = (config: CLIConfig = {}) => {
        config = {
            config: "tests/cli/data/config.json",
            source: "tests/cli/data/source/**/*.feature",
            base: "tests/cli/data/source",
            destination: "tests/cli/data/destination",
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

    const readFeatureFiles = async (path: string) => {
        const ast: Document[] = await read(path);
        return ast.map(pruneID) as Document[];
    };
    const getSources = () => readFeatureFiles("tests/cli/data/source/**/*.feature");
    const getResult = (destination = "destination") => readFeatureFiles(`tests/cli/data/${destination}/**/*.feature`);
    const deleteDirectory = (dir: string) => {
        dir = `tests/cli/data/${dir}`;
        console.log("DELETE", dir, fs.existsSync(dir));
        if (fs.existsSync(dir)) {
            try {
                rimraf.sync(dir);
            } catch (e) {
                // TODO: cannot delete
            }
        }
    };

    beforeEach(() => {
        deleteDirectory("source/dist");
        (console.log as unknown as jest.Mock).mockClear();
    });

    test("should fail if no config found", async () => {
        await expect(() => runWithArgs({
            config: null,
        })).rejects.toThrow(/Configuration file does not exist: .*.gherking.json!/);
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
        })).rejects.toThrow("Destination must be a directory!");
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
            config: "tests/cli/data/config-w-directory.json",
        })).rejects.toThrow("Path must be either a NPM package name or a JS file: test/cli/compilers!");
    });

    retryTest("should use source if no base set and source is a directory", async () => {
        await runWithArgs({
            config: "tests/cli/data/config.json",
            base: null,
            source: "tests/cli/data/source",
        });
        const sources: Document[] = await getSources();
        const results: Document[] = await getResult();
        expect(results).toHaveLength(2);
        expect(results[0].feature.name).toMatch(/PROCESSED$/);
        expect(results[0].feature.elements).toEqual(sources[0].feature.elements);
    });

    retryTest("should use dirname of source if no base set and source is a file", async () => {
        await runWithArgs({
            config: "tests/cli/data/config.json",
            base: null,
            source: "tests/cli/data/source/1.feature",
        });
        const sources: Document[] = await getSources();
        const results: Document[] = await getResult();
        expect(results).toHaveLength(1);
        expect(results[0].feature.name).toMatch(/PROCESSED$/);
        expect(results[0].feature.elements).toEqual(sources[0].feature.elements);
    });

    retryTest("should set source using base", async () => {
        await runWithArgs({
            config: "tests/cli/data/config.json",
            base: "tests/cli/data/source",
            source: null,
        });
        const sources: Document[] = await getSources();
        const results: Document[] = await getResult();
        expect(results).toHaveLength(2);
        expect(results[0].feature.name).toMatch(/PROCESSED$/);
        expect(results[0].feature.elements).toEqual(sources[0].feature.elements);
    });

    retryTest("should set destination if not set based on the base", async () => {
        await runWithArgs({
            config: "tests/cli/data/config.json",
            base: "tests/cli/data/source",
            destination: null,
        });
        const sources: Document[] = await getSources();
        const results: Document[] = await getResult("source/dist");
        expect(results).toHaveLength(2);
        expect(results[0].feature.name).toMatch(/PROCESSED$/);
        expect(results[0].feature.elements).toEqual(sources[0].feature.elements);
    });

    retryTest("should log configuration if verbose set", async () => {
        await runWithArgs({
            config: "tests/cli/data/config.json",
            verbose: false,
        });
        expect(console.log).not.toHaveBeenCalled();

        await runWithArgs({
            config: "tests/cli/data/config.json",
            verbose: true,
        });
        expect(console.log).toHaveBeenCalled();
    });

    retryTest("should use gpc-package as compiler", async () => {
        await runWithArgs({
            config: "tests/cli/data/config-w-package.json",
        });
        const sources: Document[] = await getSources();
        const results: Document[] = await getResult();
        expect(results).toHaveLength(2);
        expect(results[0].feature.name).toMatch(/PACKAGE$/);
        expect(results[0].feature.elements).toEqual(sources[0].feature.elements);
    });

    retryTest("should use custom package as compiler", async () => {
        await runWithArgs({
            config: "tests/cli/data/config-w-custom-package.json",
        });
        const sources: Document[] = await getSources();
        const results: Document[] = await getResult();
        expect(results).toHaveLength(2);
        expect(results[0].feature.name).toMatch(/PACKAGE$/);
        expect(results[0].feature.elements).toEqual(sources[0].feature.elements);
    });

    retryTest("should fail if package as compiler cannot be found", async () => {
        await expect(() => runWithArgs({
            config: "tests/cli/data/config-w-non-existing-package.json",
        })).rejects.toThrow("Cannot find module 'gpc-no-such-package' from 'src/cli.ts'");
        expect(lazyRequire).not.toHaveBeenCalled();
    });

    retryTest("should install missing package is set", async () => {
        await expect(() => runWithArgs({
            config: "tests/cli/data/config-w-non-existing-package.json",
            install: true,
        })).rejects.toThrow("Precompiler (gpc-no-such-package) must be a class or a PreCompiler object: undefined!");
        expect(lazyRequire).toHaveBeenCalledWith("gpc-no-such-package", { save: false });
    });

    retryTest("should install and save missing package is set", async () => {
        await expect(() => runWithArgs({
            config: "tests/cli/data/config-w-non-existing-package.json",
            install: true,
            save: true,
        })).rejects.toThrow("Precompiler (gpc-no-such-package) must be a class or a PreCompiler object: undefined!");
        expect(lazyRequire).toHaveBeenCalledWith("gpc-no-such-package", { save: true });
    });

    retryTest("should use compiler object", async () => {
        await runWithArgs({
            config: "tests/cli/data/config-w-object.json",
        });
        const sources: Document[] = await getSources();
        const results: Document[] = await getResult();
        expect(results).toHaveLength(2);
        expect(results[0].feature.name).toMatch(/OBJECT$/);
        expect(results[0].feature.elements).toEqual(sources[0].feature.elements);
    });

    retryTest("should use compiler as default object", async () => {
        await runWithArgs({
            config: "tests/cli/data/config-w-default-object.json",
        });
        const sources: Document[] = await getSources();
        const results: Document[] = await getResult();
        expect(results).toHaveLength(2);
        expect(results[0].feature.name).toMatch(/DEFAULT$/);
        expect(results[0].feature.elements).toEqual(sources[0].feature.elements);
    });

    retryTest("should use compiler as default class", async () => {
        await runWithArgs({
            config: "tests/cli/data/config-w-default-class.json",
        });
        const sources: Document[] = await getSources();
        const results: Document[] = await getResult();
        expect(results).toHaveLength(2);
        expect(results[0].feature.name).toMatch(/DEFAULT$/);
        expect(results[0].feature.elements).toEqual(sources[0].feature.elements);
    });

    test("should fail if compiler is neither class nor object", async () => {
        await expect(() => runWithArgs({
            config: "tests/cli/data/config-w-invalid.json"
        })).rejects.toThrow(/Precompiler \(.*gpc-test-invalid.js\) must be a class or a PreCompiler object: 1!/);
    });

    retryTest("should clean destination directory if clean is set", async () => {
        fs.copyFileSync("tests/cli/data/source/1.feature", "tests/cli/data/destination/0.feature");
        await runWithArgs({
            config: "tests/cli/data/config.json",
            clean: false,
        });
        let results: Document[] = await getResult();
        expect(results).toHaveLength(3);

        await runWithArgs({
            config: "tests/cli/data/config.json",
            clean: true,
        });
        results = await getResult();
        expect(results).toHaveLength(2);
    });

    retryTest("should create destination directory if it does not exist", async () => {
        deleteDirectory("destination");
        await runWithArgs({
            config: "tests/cli/data/config.json",
        });
        const results: Document[] = await getResult();
        expect(results).toHaveLength(2);
    });
});