import {Type} from 'ts-morph';
import {ITypeRecipeRequest} from './itype-recipe-request';

/**
 * The context available during build stage.
 */
export interface ITypeRecipeContext {

  /**
   * Resolves (or creates) a type recipe for the given type.
   */
  resolveType(type: Type): ITypeRecipeRequest;
}
