import { MultiControlType, PreCompiler, SingleControlType } from "./PreCompiler";

export abstract class ProcessorBase {
    protected preCompiler: Partial<PreCompiler>;

    constructor(preCompiler?: Partial<PreCompiler>) {
        this.preCompiler = preCompiler || {};
    }
}

export abstract class PartialProcessor<T,P,R=T|null> extends ProcessorBase {
    protected abstract preFilter(e: T, p: P): boolean;
    protected abstract postFilter(e: T, p: P): boolean;
    protected abstract process(e: T, p: P): SingleControlType<R>;
}

export abstract class Processor<T,P,R = T | null> extends PartialProcessor<T,P,R> {
    public execute(e: T, p: P): R {
        const preFilterResult = this.preFilter(e, p);
        if (!preFilterResult) {
            return null;
        }
        const result = this.process(e, p);
        if (result === null) {
            return null;
        }
        const postFilterResult = this.postFilter((result || e) as T, p);
        if (!postFilterResult) {
            return null;
        }
        return (result || e) as R;
    }
}

export abstract class PartialListProcessor<T,P> extends ProcessorBase {
    protected abstract preFilter(e: T, p: P, i: number): boolean;
    protected abstract postFilter(e: T, p: P, i: number): boolean;
    protected abstract process(e: T, p: P, i: number): MultiControlType<T>;
}

export abstract class ListProcessor<T,P> extends PartialListProcessor<T,P> {
    public execute(items: T[], p: P): T[] {
        if (!Array.isArray(items)) {
            return [];
        }
        const preFiltered = items.filter((e: T, i: number) => this.preFilter(e, p, i));
        for (let i = 0; i < preFiltered.length; ++i) {
            const result = this.process(preFiltered[i], p, i);
            if (result === null) {
                preFiltered.splice(i, 1);
                i--;
            } else if (Array.isArray(result)) {
                preFiltered.splice(i, 1, ...result);
                i += result.length;
            } else if (result) {
                preFiltered[i] = result;
            }
        }
        return preFiltered.filter((e: T, i: number) => this.postFilter(e, p, i));
    }
}