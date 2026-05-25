/**
 * Lazy Loading Engine
 * Defers loading of heavy resources until actually needed.
 */

export class LazyLoadingEngine {
  private loadedModules = new Set<string>();

  async load(moduleName: string, loader: () => Promise<any>): Promise<any> {
    if (this.loadedModules.has(moduleName)) {
      return "already_loaded";
    }
    const result = await loader();
    this.loadedModules.add(moduleName);
    return result;
  }
}

export const lazyLoadingEngine = new LazyLoadingEngine();
