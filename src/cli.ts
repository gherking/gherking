import { getDebugger } from './debug';

const debug = getDebugger("cli");

interface CompilerConfig {
    type?: string;
    path?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arguments?: any[];
}

interface CLIConfig {
    source?: string;
    base?: string;
    destination?: string;
    verbose?: boolean;
    compilers: CompilerConfig[];
}

const prepareConfig = (argv?: CLIConfig): CLIConfig => {
    return argv;
}

export function run():void {
    debug("run");
    const config = prepareConfig();
    debug("...config: %o", config);
    throw new Error("NOT IMPLEMENTED!");
}