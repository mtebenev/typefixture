import {ITypeTraitBuilder} from './itype-trait-builder';
import {Type, ts, ConstructorDeclaration} from 'ts-morph';
import {ITypeRecipe} from './itype-recipe';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipeRequest, TypeRecipeRequestKind} from './itype-recipe-request';

/**
 * Responsible for filling constructors info.
 */
export class TypeTraitBuilderConstructors implements ITypeTraitBuilder {

  private context: ITypeRecipeContext;

  constructor(context: ITypeRecipeContext) {
    this.context = context;
  }

  /**
   * ITypeTraitBuilder
   */
  public build(type: Type, typeRecipe: Partial<ITypeRecipe>): void {
    const symbol = type.getSymbolOrThrow();

    // Find a constructor with least parameters
    const ctors = symbol
      .getMembers()
      .filter(m => m.hasFlags(ts.SymbolFlags.Constructor))
      .map(m => m.getDeclarations()[0] as ConstructorDeclaration)
      .sort((cd1, cd2) => {return cd1.getParameters().length > cd2.getParameters().length ? 1 : -1;});

    // Fill constructor info if there's no default constructor (one without parameters)
    if(ctors.length > 0 && ctors[0].getParameters().length > 0) {
      const ctorArguments = ctors[0].getParameters().map(p => {
        const paramRequest = this.context.resolveType(p.getType());
        return {
          name: p.getName(),
          typeRecipeRequest: paramRequest
        }
      });
      typeRecipe.ctor = {name: 'ctor', arguments: ctorArguments};
    }
  }
}
