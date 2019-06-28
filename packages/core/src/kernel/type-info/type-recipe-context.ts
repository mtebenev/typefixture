import {Type} from 'ts-morph';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipe} from './itype-recipe';
import {TypeRecipeBuilder} from './type-recipe-builder';

/**
 * Default implementation for type recipe context.
 */
export class TypeRecipeContext implements ITypeRecipeContext {

  /**
   * ITypeRecipeContext
   */
  public resolveType(type: Type): ITypeRecipe {
    const builder = new TypeRecipeBuilder();
    return builder.build(type);
  }
}
