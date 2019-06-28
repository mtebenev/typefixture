import {ITypeRecipeRequest} from './itype-recipe-request';

/**
 * Analysis stage info for an object member.
 */
export interface IMemberRecipe {

  /**
   * Member name.
   */
  name: string;

  /**
   * The request satisfying the member creation.
   */
  request: ITypeRecipeRequest;
}
