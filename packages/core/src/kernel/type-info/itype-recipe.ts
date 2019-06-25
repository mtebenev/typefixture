import {IMemberInfo} from './imember-info';

/**
 * Type information extracted during source analysys stage.
 */
export interface ITypeRecipe {

  /**
   * Public fields info.
   */
  fields: IMemberInfo[];

  /**
   * If defined then it's name of the class.
   */
  className?: string;
}
