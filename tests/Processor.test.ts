import { MultiControlType } from "../src/PreCompiler";
import { ListProcessor, Processor } from "../src/Processor"

class Child {
    constructor(public property: string) { }
}

class Parent {
    constructor(public child: Child) { }
}

class List {
    constructor(public items: Child[]) { }
}

describe("Processors", () => {
    describe("Processor", () => {
        let child: Child;
        let parent: Parent;

        beforeEach(() => {
            child = new Child("child");
            parent = new Parent(child);
        });

        test("should handle missing element", async () => {
            class EmptyProcessor extends Processor<Child, Parent> {
                protected async preFilter(_e: Child, _p: Parent): Promise<boolean> {
                    return true;
                }
                protected async postFilter(_e: Child, _p: Parent): Promise<boolean> {
                    return true;
                }
                protected async process(_e: Child, _p: Parent): Promise<Child> {
                    return new Child("new");
                }
            }

            const processor = new EmptyProcessor({});
            const result = await processor.execute(null, parent);

            expect(result).toBeNull();
        })

        test("should filter out single property via pre-filter", async () => {
            class PreFilterProcessor extends Processor<Child, Parent> {
                protected async preFilter(_e: Child, _p: Parent): Promise<boolean> {
                    return false;
                }
                protected async postFilter(_e: Child, _p: Parent): Promise<boolean> {
                    return true;
                }
                protected async process(_e: Child, _p: Parent): Promise<Child> {
                    return new Child("new");
                }
            }

            const processor = new PreFilterProcessor({});
            const result = await processor.execute(child, parent);

            expect(result).toBeNull();
        });

        test("should filter out single property via post-filter", async () => {
            class PostFilterProcessor extends Processor<Child, Parent> {
                protected async preFilter(_e: Child, _p: Parent): Promise<boolean> {
                    return true;
                }
                protected async postFilter(_e: Child, _p: Parent): Promise<boolean> {
                    return false;
                }
                protected async process(_e: Child, _p: Parent): Promise<Child> {
                    return new Child("new");
                }
            }

            const processor = new PostFilterProcessor({});
            const result = await processor.execute(child, parent);

            expect(result).toBeNull();
        });

        test("should filter out single property by event handler", async () => {
            class EventHandlerProcessor extends Processor<Child, Parent> {
                protected async preFilter(_e: Child, _p: Parent): Promise<boolean> {
                    return true;
                }
                protected async postFilter(_e: Child, _p: Parent): Promise<boolean> {
                    return true;
                }
                protected async process(_e: Child, _p: Parent): Promise<Child> {
                    return null;
                }
            }

            const processor = new EventHandlerProcessor({});
            const result = await processor.execute(child, parent);

            expect(result).toBeNull();
        });

        test("should return result of processing", async () => {
            class ResultProcessor extends Processor<Child, Parent> {
                protected async preFilter(_e: Child, _p: Parent): Promise<boolean> {
                    return true;
                }
                protected async postFilter(_e: Child, _p: Parent): Promise<boolean> {
                    return true;
                }
                protected async process(_e: Child, _p: Parent): Promise<Child> {
                    return new Child("new");
                }
            }

            const processor = new ResultProcessor({});
            const result = await processor.execute(child, parent);

            expect(result.property).toBe("new");
        });

        test("should have idempotent processor", async () => {
            class IdempotentProcessor extends Processor<Child, Parent> {
                protected async preFilter(e: Child, p: Parent): Promise<boolean> {
                    // @ts-ignore
                    expect(e, "Element should be passed to pre-filter").toBe(child);
                    // @ts-ignore
                    expect(p, "Parent should be passed to pre-filter").toBe(parent);
                    return true;
                }
                protected async postFilter(e: Child, p: Parent): Promise<boolean> {
                    // @ts-ignore
                    expect(e, "Element should be passed to post-filter").toBe(child);
                    // @ts-ignore
                    expect(p, "Parent should be passed to post-filter").toBe(parent);
                    return true;
                }
                protected async process(e: Child, p: Parent): Promise<Child> {
                    // @ts-ignore
                    expect(e, "Element should be passed to process").toBe(child);
                    // @ts-ignore
                    expect(p, "Parent should be passed to process").toBe(parent);
                    return undefined;
                }
            }

            const processor = new IdempotentProcessor();
            const result = await processor.execute(child, parent);

            expect(result).toBe(child);
            expect(parent.child).toBe(child);
        });
    });

    describe("ListProcessor", () => {
        let items: Child[];
        let list: List;

        beforeEach(() => {
            items = [
                new Child("1"),
                new Child("2"),
                new Child("3"),
            ];
            list = new List(items);
        })

        test("should handle incorrect input, i.e. not an array", async () => {
            class ErrorListProcessor extends ListProcessor<Child, List> {
                protected async preFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    throw new Error("Method not implemented.");
                }
                protected async postFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    throw new Error("Method not implemented.");
                }
                protected async process(_e: Child, _p: List, _i: number): Promise<MultiControlType<Child>> {
                    throw new Error("Method not implemented.");
                }
            }

            const processor = new ErrorListProcessor({});
            const result = await processor.execute(null, null);

            expect(result).toEqual([]);
        });

        test("should filter items by pre-filter", async () => {
            class PreFilterListProcessor extends ListProcessor<Child, List> {
                protected async preFilter(e: Child, _p: List, _i: number): Promise<boolean> {
                    return +e.property > 2;
                }
                protected async postFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async process(_e: Child, _p: List, _i: number): Promise<MultiControlType<Child>> {
                    return undefined;
                }
            }

            const processor = new PreFilterListProcessor({});
            const result = await processor.execute(items, list);

            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result[0].property).toBe("3");
        });

        test("should filter items by post-filter", async () => {
            class PostFilterListProcessor extends ListProcessor<Child, List> {
                protected async preFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async postFilter(e: Child, _p: List, _i: number): Promise<boolean> {
                    return +e.property > 2;
                }
                protected async process(_e: Child, _p: List, _i: number): Promise<MultiControlType<Child>> {
                    return undefined;
                }
            }

            const processor = new PostFilterListProcessor({});
            const result = await processor.execute(items, list);

            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result[0].property).toBe("3");
        });

        test("should filter array of items by post-filter", async () => {
            class PostFilterListProcessor extends ListProcessor<Child, List> {
                protected async preFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async postFilter(e: Child, _p: List, _i: number): Promise<boolean> {
                    return +e.property > 2;
                }
                protected async process(_e: Child, _p: List, _i: number): Promise<MultiControlType<Child>> {
                    return [_e, _e];
                }
            }

            const processor = new PostFilterListProcessor({});
            const result = await processor.execute(items, list);

            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(2);
            expect(result[0].property).toBe("3");
            expect(result[1].property).toBe("3");
        });

        test("should filter out array of items by post-filter", async () => {
            class PostFilterListProcessor extends Processor<Child, List, MultiControlType<Child>> {
                protected async preFilter(_e: Child, _p: List): Promise<boolean> {
                    return true;
                }
                protected async postFilter(e: Child, _p: List): Promise<boolean> {
                    return +e.property > 3;
                }
                protected async process(_e: Child, _p: List): Promise<MultiControlType<Child>> {
                    return [_e, _e];
                }
            }

            const processor = new PostFilterListProcessor({});
            const result = await processor.execute(items[0], list);
            expect(result).toBeNull();
        });

        test("should filter items by event handler", async () => {
            class EventHandlerDeleteListProcessor extends ListProcessor<Child, List> {
                protected async preFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async postFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async process(e: Child, _p: List, _i: number): Promise<MultiControlType<Child>> {
                    return e.property === "2" ? null : undefined;
                }
            }

            const processor = new EventHandlerDeleteListProcessor({});
            const result = await processor.execute(items, list);

            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(2);
            expect(result[0].property).toBe("1");
            expect(result[1].property).toBe("3");
        });

        test("should overwrite an item with a sinlge item by event handler", async () => {
            class SingleReplacerListProcessor extends ListProcessor<Child, List> {
                protected async preFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async postFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async process(e: Child, _p: List, _i: number): Promise<MultiControlType<Child>> {
                    return e.property === "2" ? new Child("4") : undefined;
                }
            }

            const processor = new SingleReplacerListProcessor({});
            const result = await processor.execute(items, list);

            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(3);
            expect(result[0].property).toBe("1");
            expect(result[1].property).toBe("4");
            expect(result[2].property).toBe("3");
        });

        test("should overwrite an item with multiple items by event handler", async () => {
            class MultiReplacerListProcessor extends ListProcessor<Child, List> {
                protected async preFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async postFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async process(e: Child, _p: List, _i: number): Promise<MultiControlType<Child>> {
                    return e.property === "2" ? [new Child("4"), new Child("5")] : undefined;
                }
            }

            const processor = new MultiReplacerListProcessor({});
            const result = await processor.execute(items, list);

            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(4);
            expect(result[0].property).toBe("1");
            expect(result[1].property).toBe("4");
            expect(result[2].property).toBe("5");
            expect(result[3].property).toBe("3");
        });

        test("should have idempotent processor", async () => {
            class IdempotentListProcessor extends ListProcessor<Child, List> {
                private checkParameters(e: Child, p: List, i: number): void {
                    // @ts-ignore
                    expect(items, "Child should be passed to pre-filter").toContainEqual(e);
                    // @ts-ignore
                    expect(p, "Parent should be passed to pre-filter").toBe(list);
                    // @ts-ignore
                    expect(i, "Index should be passed to pre-filter").toBeGreaterThanOrEqual(0);
                    // @ts-ignore
                    expect(i, "Index should be passed to pre-filter").toBeLessThan(items.length);
                }

                protected async preFilter(e: Child, p: List, i: number): Promise<boolean> {
                    this.checkParameters(e, p, i);
                    return true;
                }
                protected async postFilter(e: Child, p: List, i: number): Promise<boolean> {
                    this.checkParameters(e, p, i);
                    return true;
                }
                protected async process(e: Child, p: List, i: number): Promise<Child> {
                    this.checkParameters(e, p, i);
                    return undefined;
                }
            }

            const processor = new IdempotentListProcessor();
            const result = await processor.execute(items, list);

            expect(result).toEqual(items);
            expect(list.items).toBe(items);
        });

        test("should handle when result is null", async () => {
            class NullListProcessor extends ListProcessor<Child, List> {
                protected async preFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async postFilter(_e: Child, _p: List, _i: number): Promise<boolean> {
                    return true;
                }
                protected async process(e: Child, _p: List, _i: number): Promise<MultiControlType<Child>> {
                    return e.property === "3" ? null : e;
                }
            }

            const processor = new NullListProcessor({});
            const result = await processor.execute(items, list);

            expect(result.length).toBe(2);
            expect(result[0].property).toBe("1");
            expect(result[1].property).toBe("2");
        })
    })
});