import {ITypeTraitBuilder} from './itype-trait-builder';
import {Type, PropertySignature, Symbol} from 'ts-morph';
import {ITypeRecipe} from './itype-recipe';
import {ITypeRecipeContext} from './itype-recipe-context';
import {IMemberRecipe} from './imember-recipe';
import {ITypeRecipeRequest, TypeRecipeRequestKind} from './itype-recipe-request';

/**
 * Responsible for filling fields info.
 */
export class TypeTraitBuilderFields implements ITypeTraitBuilder {

  private context: ITypeRecipeContext;

  constructor(context: ITypeRecipeContext) {
    this.context = context;
  }

  /**
   * ITypeTraitBuilder
   */
  public build(type: Type, typeInfo: Partial<ITypeRecipe>): void {
    const props = type.getProperties();
    typeInfo.fields = props.map(p => this.createFieldRequest(p));
  }

  /**
   * Creates request for given member symbol.
   */
  // tslint:disable-next-line:ban-types
  private createFieldRequest(propertySymbol: Symbol): IMemberRecipe {

    const propSignature = propertySymbol.getDeclarations()[0] as PropertySignature;
    const propType = propSignature.getType();
    let memberRequest: ITypeRecipeRequest;

    if(propType.isString()) {
      memberRequest = {kind: TypeRecipeRequestKind.string};
    } else if(propType.isNumber()) {
      memberRequest = {kind: TypeRecipeRequestKind.number};
    } else {
      memberRequest = this.context.resolveTypeOrThrow(propType);
    }

    const memberRecipe: IMemberRecipe = {
      name: propertySymbol.getName(),
      request: memberRequest
    };
    return memberRecipe;
  }
}
