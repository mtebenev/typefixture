import {Type, TypeGuards} from 'ts-morph';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipeBuilder} from './itype-recipe-builder';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipeRequest, TypeRecipeRequestKind} from './itype-recipe-request';
import {TypeTraitBuilderConstructors} from './type-trait-builder-constructors';

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
        typeRecipeRequest = {
          kind: TypeRecipeRequestKind.recipe,
          value: {
            className: symbol.getFullyQualifiedName(),
            fields: []
          }
        };
      }
    }

    // Explicit constructor info
    if(typeRecipeRequest && typeRecipeRequest.value) {
      const constructorBuilder = new TypeTraitBuilderConstructors(context);
      constructorBuilder.build(type, typeRecipeRequest.value);
    }

    return typeRecipeRequest ? typeRecipeRequest : new NoTypeInfo();
  }
}
