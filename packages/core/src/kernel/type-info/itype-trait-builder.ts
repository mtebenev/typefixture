import {Type} from 'ts-morph';
import {ITypeRecipe} from './itype-recipe';

/**
 * Type trait builders are responsible for building some specific parts of a type like
 * methods, constructors etc.
 */
export interface ITypeTraitBuilder {

  /**
   * Builds a type trait.
   * @param type Source type.
   * @param typeRecipe Target type recipe structure.
   */
  build(type: Type, typeRecipe: Partial<ITypeRecipe>): void;
}
