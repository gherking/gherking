import { run, CLIConfig } from "../src/cli";

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

    test("should fail if no config found", async () => {
        await expect(() => runWithArgs({
            config: null,
        })).rejects.toThrow("Configuration file does not exist: /home/laszloszikszai/Work/gherking/precompiler.json!");
    });
});