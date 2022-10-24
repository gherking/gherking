import { MultiControlType, PreCompiler, SingleControlType } from "./PreCompiler";
import { getDebugger } from "./debug";

const processorDebug = getDebugger("Processor")
const listProcessorDebug = getDebugger("ListProcessor");

export abstract class ProcessorBase {
    protected preCompiler: Partial<PreCompiler>;

    constructor(preCompiler?: Partial<PreCompiler>) {
        this.preCompiler = preCompiler || {};
    }

    protected static async filter<T>(items: T[], fn: (e: T, i: number) => Promise<boolean>): Promise<T[]> {
        const filtered: T[] = [];
        for (let i = 0; i < items.length; ++i) {
            try {
                if (await fn(items[i], i)) {
                    filtered.push(items[i]);
                }
            } catch (e) {
                // noop
            }
        }
        return filtered;
    }

    protected static async map<T, R = T>(items: T[], fn: (e: T, i: number) => Promise<R>): Promise<R[]> {
        const mapped: R[] = [];
        for (let i = 0; i < items.length; ++i) {
            mapped.push(await fn(items[i], i));
        }
        return mapped;
    }
}

export abstract class PartialProcessor<T, P, R = T | null> extends ProcessorBase {
    /* eslint-disable no-unused-vars */
    protected abstract preFilter(e: T, p: P): Promise<boolean>;
    protected abstract postFilter(e: T, p: P): Promise<boolean>;
    protected abstract process(e: T, p: P): Promise<SingleControlType<R>>;
}

export abstract class Processor<T, P, R = T | null> extends PartialProcessor<T, P, R> {
    public async execute(e: T, p: P): Promise<R> {
        /* istanbul ignore next */
        processorDebug("execute(e: %s, p: %s)", e?.constructor.name, p?.constructor.name);
        if (!e) {
            processorDebug("...!e");
            return null;
        }
        const preFilterResult = await this.preFilter(e, p);
        if (!preFilterResult) {
            processorDebug("...!preFilterResult");
            return null;
        }
        let result = await this.process(e, p);
        if (result === null) {
            processorDebug("...!result");
            return null;
        }
        if (Array.isArray(result)) {
            processorDebug("...!array");
            // @ts-ignore
            result = await Processor.filter(result, r => this.postFilter(r as T, p));
            // @ts-ignore
            if (!result.length) {
                processorDebug("...!postFilterResult");
                return null;
            }
        } else {
            const postFilterResult = await this.postFilter((result || e) as T, p);
            if (!postFilterResult) {
                processorDebug("...!postFilterResult");
                return null;
            }
        }
        processorDebug("...result: %o", result || e);
        return (result || e) as R;
    }
}

export abstract class PartialListProcessor<T, P, R = T> extends ProcessorBase {
    /* eslint-disable no-unused-vars */
    protected abstract preFilter(e: T, p: P, i: number): Promise<boolean>;
    protected abstract postFilter(e: T, p: P, i: number): Promise<boolean>;
    protected abstract process(e: T, p: P, i: number): Promise<MultiControlType<R>>;
}

export abstract class ListProcessor<T, P> extends PartialListProcessor<T, P> {
    public async execute(items: T[], p: P): Promise<T[]> {
        /* istanbul ignore next */
        listProcessorDebug("execute(e: %s, p: %s)", items?.constructor.name, p?.constructor.name);
        if (!Array.isArray(items) || !items.length) {
            listProcessorDebug("...!Array");
            return [];
        }
        const preFiltered = await ListProcessor.filter(items, (e: T, i: number) => this.preFilter(e, p, i));
        listProcessorDebug("...preFilter: %d -> %d", items.length, preFiltered.length);
        for (let i = 0; i < preFiltered.length; ++i) {
            listProcessorDebug("...processing #%d", i);
            const result = await this.process(preFiltered[i], p, i);
            if (result === null) {
                listProcessorDebug("......!result");
                preFiltered.splice(i, 1);
                i--;
            } else if (Array.isArray(result)) {
                listProcessorDebug("......Array: %d", result.length);
                preFiltered.splice(i, 1, ...result);
                i += result.length - 1;
            } else if (result) {
                listProcessorDebug("......replace: %o", result);
                preFiltered[i] = result;
            } else {
                listProcessorDebug("......noop");
            }
        }
        const postFiltered = await ListProcessor.filter(preFiltered, (e: T, i: number) => this.postFilter(e, p, i));
        listProcessorDebug("...postFilter: %d -> %d", preFiltered.length, postFiltered.length);
        return postFiltered;
    }
}