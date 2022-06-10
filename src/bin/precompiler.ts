#!/usr/bin/env node
import { run } from "../cli";

(async () => {
    try {
        await run();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
