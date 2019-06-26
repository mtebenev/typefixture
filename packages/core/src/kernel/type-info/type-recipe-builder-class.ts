import {Type, TypeGuards} from 'ts-morph';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipeBuilder} from './itype-recipe-builder';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipe} from './itype-recipe';

/**
 * Can build type recipe for a class.
 */
export class TypeRecipeBuilderClass implements ITypeRecipeBuilder {

  /**
   * ITypeInfoBuilder
.   */
  public create(type: Type, context: ITypeRecipeContext): ITypeRecipe | NoTypeInfo {

    // Check if the type is a class
    let result: ITypeRecipe | NoTypeInfo = new NoTypeInfo();
    const symbol = type.getSymbol();
    if(symbol) {
      const isClass = symbol.getDeclarations().some(d => TypeGuards.isClassDeclaration(d));
      if(isClass) {
        const typeRecipe: ITypeRecipe = {
          className: symbol.getFullyQualifiedName(),
          fields: []
        };
        result = typeRecipe;
      }
    }

    return result;
  }
}
