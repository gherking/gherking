declare namespace jest {
    
    interface Expect {
        /**
         * The `expect` function is used every time you want to test a value.
         * You will rarely call `expect` by itself.
         *
         * @param actual The value to apply matchers against.
         */
        <T = any>(actual: T, message?: string): JestMatchers<T>;
    }
}