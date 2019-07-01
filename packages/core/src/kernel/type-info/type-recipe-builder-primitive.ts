import {Type, TypeGuards} from 'ts-morph';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipeBuilder} from './itype-recipe-builder';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipeRequest, TypeRecipeRequestKind} from './itype-recipe-request';

/**
 * Can build type recipe for primitive types.
 */
export class TypeRecipeBuilderPrimitive implements ITypeRecipeBuilder {

  /**
   * ITypeInfoBuilder
   */
  public create(type: Type, context: ITypeRecipeContext): ITypeRecipeRequest | NoTypeInfo {

    let typeRecipeRequest: ITypeRecipeRequest | undefined;
    if(type.isString()) {
      typeRecipeRequest = {kind: TypeRecipeRequestKind.string};
    } else if(type.isNumber()) {
      typeRecipeRequest = {kind: TypeRecipeRequestKind.number};
    }

    return typeRecipeRequest ? typeRecipeRequest : new NoTypeInfo();
  }
}
