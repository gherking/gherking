import debug = require("debug");

export const getDebugger = (m: string) => debug(`gherking:${m}`);