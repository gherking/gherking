import { PreCompiler } from "./PreCompiler";
import {read, write, FormatOptions} from "gherkin-io";
import { Document } from "gherkin-ast";

export * from "./PreCompiler";
export * from "gherkin-ast";
export {FormatOptions} from "gherkin-io";

export const load = read;

export const process = (ast: Document, ...preCompilers: PreCompiler[]): Document[] => {
    let documents = [ast];
    // TODO
    return documents;
}

export type PathGenerator = (document: Document, i?: number) => string;
export async function save(path: string, ast: Document, options?: FormatOptions): Promise<void>;
export async function save(path: PathGenerator, ast: Document[], options?: FormatOptions): Promise<void>;
export async function save(path: string | PathGenerator, ast: Document | Document[], options?: FormatOptions): Promise<void> {
    if (!path) {
        throw new TypeError("path parameter must be set, either as a string or a PathGenerator");
    }
    if (Array.isArray(ast)) {
        let pathGenerator = path as PathGenerator;
        if (typeof path === "string") {
            if (!/\.feature$/.test(path)) {
                path += ".feature";
            }
            pathGenerator = (document: Document, i: number) => String(path).replace(/\.feature$/, `${i}.feature`);
        }
        for (let i = 0; i < ast.length; ++i) {
            const filePath = pathGenerator(ast[i], i);
            await write(filePath, ast[i], options);
        }
    } else {
        if (typeof path !== "string") {
            path = path(ast);
        }
        await write(path, ast, options);
    }
}