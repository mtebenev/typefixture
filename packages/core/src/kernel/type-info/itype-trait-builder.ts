import {Type} from 'ts-morph';
import {ITypeInfo} from './itype-info';

/**
 * Type trait builders are responsible for building some specific parts of a type like
 * methods, constructors etc.
 */
export interface ITypeTraitBuilder {

  /**
   * Builds a type trait.
   * @param type Source type.
   * @param typeInfo Target type info structure.
   */
  build(type: Type, typeInfo: ITypeInfo): void;
}
