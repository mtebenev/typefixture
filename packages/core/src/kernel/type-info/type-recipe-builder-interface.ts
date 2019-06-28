import {Type, TypeGuards} from 'ts-morph';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipeBuilder} from './itype-recipe-builder';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipe} from './itype-recipe';
import {TypeTraitBuilderFields} from './type-trait-builder-fields';

/**
 * Can build type recipe for an interface.
 */
export class TypeRecipeBuilderInterface implements ITypeRecipeBuilder {

  /**
   * ITypeInfoBuilder
.   */
  public create(type: Type, context: ITypeRecipeContext): ITypeRecipe | NoTypeInfo {

    // Check if the type is an interface
    let result: ITypeRecipe | NoTypeInfo = new NoTypeInfo();
    const symbol = type.getSymbol();
    if(symbol) {
      const isInterface = symbol.getDeclarations().some(d => TypeGuards.isInterfaceDeclaration(d));
      if(isInterface) {
        const typeRecipe: ITypeRecipe = {
          fields: []
        };

        const fieldsBuilder = new TypeTraitBuilderFields(context);
        fieldsBuilder.build(type, typeRecipe);
        result = typeRecipe;
      }
    }

    return result;
  }
}
