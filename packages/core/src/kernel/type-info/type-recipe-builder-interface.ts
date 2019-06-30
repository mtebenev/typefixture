import {Type, TypeGuards} from 'ts-morph';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipeBuilder} from './itype-recipe-builder';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipe} from './itype-recipe';
import {TypeTraitBuilderFields} from './type-trait-builder-fields';
import {ITypeRecipeRequest, TypeRecipeRequestKind} from './itype-recipe-request';

/**
 * Can build type recipe for an interface.
 */
export class TypeRecipeBuilderInterface implements ITypeRecipeBuilder {

  /**
   * ITypeInfoBuilder
   */
  public create(type: Type, context: ITypeRecipeContext): ITypeRecipeRequest | NoTypeInfo {

    // Check if the type is an interface
    let typeRecipeRequest: ITypeRecipeRequest | undefined;
    const symbol = type.getSymbol();
    if(symbol) {
      const isInterface = symbol.getDeclarations().some(d => TypeGuards.isInterfaceDeclaration(d));
      if(isInterface) {
        const typeRecipe: ITypeRecipe = {
          fields: []
        };

        const fieldsBuilder = new TypeTraitBuilderFields(context);
        fieldsBuilder.build(type, typeRecipe);
        typeRecipeRequest = {
          kind: TypeRecipeRequestKind.recipe,
          value: typeRecipe
        };
      }
    }

    return typeRecipeRequest ? typeRecipeRequest : new NoTypeInfo();
  }
}
