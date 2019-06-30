import {Type} from 'ts-morph';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipeRequest} from './itype-recipe-request';
import {ITypeRecipeBuilder} from './itype-recipe-builder';
import {NoTypeInfo} from './no-type-info';

/**
 * Default implementation for type recipe context.
 */
export class TypeRecipeContext implements ITypeRecipeContext {

  private builder: ITypeRecipeBuilder;

  constructor(builder: ITypeRecipeBuilder) {
    this.builder = builder;
  }

  /**
   * ITypeRecipeContext
   */
  public resolveType(type: Type): ITypeRecipeRequest | NoTypeInfo {
    return this.builder.create(type, this);
  }

  /**
   * ITypeRecipeContext
   */
  public resolveTypeOrThrow(type: Type): ITypeRecipeRequest {
    const result = this.resolveType(type);
    if(result instanceof NoTypeInfo) {
      throw new Error('Cannot resolve type.');
    }
    return result;
  }
}
