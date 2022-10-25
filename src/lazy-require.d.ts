declare module "lazy-require" {
  interface LazyRequireOptions {
    save?: boolean;
    cwd?: string;
  }
  interface LazyRequire {
    (name: string, options: LazyRequireOptions): unknown;
    installSync: (...args: unknown[]) => void;
    _installSync: (...args: unknown[]) => void
  }
  const lazyRequire: LazyRequire;
  export = lazyRequire;
}