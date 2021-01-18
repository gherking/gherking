import { Processor } from "../src/Processor"

class Child {
    constructor(public property: string){}
}

class Parent {
    constructor(public child: Child){}
}

describe("Processors", () => {
    describe("Processor", () => {
        class TestProcessor extends Processor<Child, Parent> {
            protected preFilter(e: Child, p: Parent): boolean {
                return 
            }
            protected postFilter(e: Child, p: Parent): boolean {
                throw new Error("Method not implemented.")
            }
            protected process(e: Child, p: Parent): Child {
                throw new Error("Method not implemented.")
            }

        }
    })
})