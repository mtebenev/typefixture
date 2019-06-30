import {Type, TypeGuards} from 'ts-morph';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipeBuilder} from './itype-recipe-builder';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipeRequest, TypeRecipeRequestKind} from './itype-recipe-request';

/**
 * Can build type recipe for a class.
 */
export class TypeRecipeBuilderClass implements ITypeRecipeBuilder {

  /**
   * ITypeInfoBuilder
   */
  public create(type: Type, context: ITypeRecipeContext): ITypeRecipeRequest | NoTypeInfo {

    // Check if the type is a class
    let typeRecipeRequest: ITypeRecipeRequest | undefined;
    const symbol = type.getSymbol();
    if(symbol) {
      const isClass = symbol.getDeclarations().some(d => TypeGuards.isClassDeclaration(d));
      if(isClass) {
        const typeRecipe: ITypeRecipeRequest = {
          kind: TypeRecipeRequestKind.recipe,
          value: {
            className: symbol.getFullyQualifiedName(),
            fields: []
          }
        };
        typeRecipeRequest = typeRecipe;
      }
    }

    return typeRecipeRequest ? typeRecipeRequest : new NoTypeInfo();
  }
}
