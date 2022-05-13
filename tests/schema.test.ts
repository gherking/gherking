import { join } from "path";
import { readFileSync } from "fs";
import { matchers } from "jest-json-schema";
expect.extend(matchers);

const readJSON = (p: string) => JSON.parse(readFileSync(join(__dirname, p), "utf-8"));
const schema = readJSON("../schema/gherking.schema.json");

describe(".gherking.json schema", () => {
  test("should handle valid .gherking.json", () => {
    const config = readJSON("./data/.gherking.json");

    expect(config).toMatchSchema(schema);
  });
  test("should handle minimal valid .gherking.json", () => {
    const config = readJSON("./data/.gherking.min.json");

    expect(config).toMatchSchema(schema);
  });
});