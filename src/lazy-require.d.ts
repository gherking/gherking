declare module "lazy-require" {
  const lazyRequire: NodeRequire & { installSync: (...args: unknown[]) => void, _installSync: (...args: unknown[]) => void };
  export = lazyRequire;
}