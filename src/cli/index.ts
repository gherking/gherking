import yargs = require("yargs/yargs");

export async function run() {
    await yargs(process.argv.slice(2))
        .scriptName("gherking")
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .command(require("./module/precompile"))
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .command(require("./module/init"))
        .demandCommand()
        .argv;
}