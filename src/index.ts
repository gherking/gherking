import { PreCompiler } from "./PreCompiler";
import { read, write, FormatOptions } from "gherkin-io";
import { Document } from "gherkin-ast";
import { DocumentProcessor } from "./DocumentProcessor";

export * from "./PreCompiler";
export * from "gherkin-ast";
export { FormatOptions } from "gherkin-io";

export const load = read;

export const process = (ast: Document, ...preCompilers: PreCompiler[]): Document[] => {
    const documents = [ast];
    for (const preCompiler of preCompilers) {
        const processor = new DocumentProcessor(preCompiler);
        for (let i = 0; i < documents.length; ++i) {
            const newDocuments = processor.execute(documents[i]);
            documents.splice(i, 1, ...newDocuments);
            i += newDocuments.length - 1;
        }
    }
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
            pathGenerator = (_1: Document, i: number) => String(path).replace(/\.feature$/, `${i}.feature`);
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