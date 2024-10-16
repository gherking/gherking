import * as fs from "fs";
import { Document } from "gherkin-ast";
import { load, save } from "../src";

describe("API", () => {
  describe("load", () => {
    test("should load Documents", async () => {
      const asts: Document[] = await load("tests/cli/data/source/*.feature");
      expect(asts).toHaveLength(2);
    });
  });

  const cleanDirectory = (dir: string) => {
    dir = `tests/cli/data/${dir}`;
    if (fs.existsSync(dir)) {
      (fs.rmSync ? fs.rmSync : fs.rmdirSync)(dir, { recursive: true });
    }
    fs.mkdirSync(dir, { recursive: true });
  };

  describe("save", () => {
    beforeEach(() => {
      cleanDirectory("destination");
    });

    test("should fail if no path set", async () => {
      // @ts-ignore
      await expect(save()).rejects.toThrow("path parameter must be set, either as a string or a PathGenerator");
    });

    test("should save single AST to single file", async () => {
      const sources: Document[] = await load("tests/cli/data/source/*.feature");
      await save("tests/cli/data/output/dest1.feature", sources[0]);
      const results: Document[] = await load("tests/cli/data/output/dest1.feature");
      expect(results).toHaveLength(1);
    });

    test("should save single AST to single file without extension", async () => {
      const sources: Document[] = await load("tests/cli/data/source/1.feature");
      await save("tests/cli/data/output/dest2", sources);
      const results: Document[] = await load("tests/cli/data/output/dest2.feature");
      expect(results).toHaveLength(1);
    });

    test("should save single AST to generated file name", async () => {
      const sources: Document[] = await load("tests/cli/data/source/*.feature");
      // @ts-ignore
      await save((ast: Document): string => {
        return "tests/cli/data/output/" + ast.feature.name.replace(/ /g, "_");
      }, sources[0]);
      const results: Document[] = await load("tests/cli/data/output/Guess_the_word.feature");
      expect(results).toHaveLength(1);
    });

    test("should save multiple AST using path generator", async () => {
      const sources: Document[] = await load("tests/cli/data/source/*.feature");
      await save((ast: Document, i: number): string => {
        return "tests/cli/data/output/" + ast.feature.name.replace(/ /g, "" + (i + 1)) + ".feature";
      }, sources);
      const results: Document[] = await load("tests/cli/data/output/Guess1the1word.feature");
      expect(results).toHaveLength(1);
    });

    test("should save multiple AST using path generator what does not add extension", async () => {
      const sources: Document[] = await load("tests/cli/data/source/*.feature");
      await save((ast: Document, i: number): string => {
        return "tests/cli/data/output/" + ast.feature.name.replace(/ /g, "" + i);
      }, sources);
      const results: Document[] = await load("tests/cli/data/output/Guess0the0word.feature");
      expect(results).toHaveLength(1);
    });

    test("should save multiple AST with default filename generator", async () => {
      const sources: Document[] = await load("tests/cli/data/source/*.feature");
      await save("tests/cli/data/output/dest3.feature", sources);
      const results: Document[] = await load("tests/cli/data/output/dest30.feature");
      expect(results).toHaveLength(1);
    });

    test("should save multiple AST with default filename generator even if extension is missing", async () => {
      const sources: Document[] = await load("tests/cli/data/source/*.feature");
      await save("tests/cli/data/output/dest4", sources);
      const results: Document[] = await load("tests/cli/data/output/dest40.feature");
      expect(results).toHaveLength(1);
    });
  });
});
