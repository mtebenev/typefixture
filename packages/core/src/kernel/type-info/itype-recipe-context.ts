import {Type} from 'ts-morph';
import {ITypeRecipeRequest} from './itype-recipe-request';
import {NoTypeInfo} from './no-type-info';

/**
 * The context available during build stage.
 */
export interface ITypeRecipeContext {

  /**
   * Resolves (or creates) a type recipe for the given type.
   */
  resolveType(type: Type): ITypeRecipeRequest | NoTypeInfo;

  /**
   * Resolves the type or throws if cannot resolve.
   */
  resolveTypeOrThrow(type: Type): ITypeRecipeRequest;
}
