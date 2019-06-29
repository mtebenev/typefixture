import {ITypeRecipeRequest} from './itype-recipe-request';

/**
 * Defines recipe for a method's argument.
 */
export interface IArgumentRecipe {

  /**
   * The argument name.
   */
  name: string;

  /**
   * The argument type.
   */
  typeRecipeRequest: ITypeRecipeRequest;
}
