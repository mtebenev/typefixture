export interface Type<T> extends Function {
  new (...args: any[]): T;
}

export type Constructor<T> = Function & { prototype: T };

/**
 * Simple decorator to emit metadata
 */
export function AddMetadata(constructor: Function): void {
  // Empty
}
