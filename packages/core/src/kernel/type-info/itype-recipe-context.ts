import {Type} from 'ts-morph';
import {ITypeRecipe} from './itype-recipe';

/**
 * The context available during build stage.
 */
export interface ITypeRecipeContext {

  /**
   * Resolves (or creates) a type recipe for the given type.
   */
  resolveType(type: Type): ITypeRecipe;
}
