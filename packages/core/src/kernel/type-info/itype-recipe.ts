import {IMemberRecipe} from './imember-recipe';

/**
 * Type information extracted during source analysys stage.
 */
export interface ITypeRecipe {

  /**
   * Public fields info.
   */
  fields: IMemberRecipe[];

  /**
   * If defined then it's name of the class.
   */
  className?: string;
}
