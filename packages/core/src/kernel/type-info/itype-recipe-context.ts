import {ITypeRecipe} from './itype-recipe';

/**
 * The context available during build stage.
 */
export interface ITypeRecipeContext {
  resolve(): ITypeRecipe;
}
