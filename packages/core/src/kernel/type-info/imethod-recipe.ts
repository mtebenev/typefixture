import {IArgumentRecipe} from './iargument-recipe';

/**
 * Defines recipe for a class/interface method.
 */
export interface IMethodRecipe {

  /**
   * The method name.
   */
  name: string;

  /**
   * The method arguments.
   */
  arguments: IArgumentRecipe[];
}
