export const command = "init";
export const description = "Initializes a GherKing project";

export const builder = {};

export function handler(argv: any):void {
    console.log("INIT", argv);
}