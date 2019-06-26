import {ITypeTraitBuilder} from './itype-trait-builder';
import {Type, PropertySignature, Symbol} from 'ts-morph';
import {IMemberInfo} from './imember-info';
import {RequestKind} from '../ispecimen-request';
import {ITypeRecipe} from './itype-recipe';

/**
 * Responsible for filling fields info.
 */
export class TypeTraitBuilderFields implements ITypeTraitBuilder {

  /**
   * ITypeTraitBuilder
   */
  public build(type: Type, typeInfo: Partial<ITypeRecipe>): void {
    const props = type.getProperties();
    typeInfo.fields = props.map(p => this.createFieldRequest(p))
  }

  /**
   * Creates request for given member symbol.
   */
  private createFieldRequest(propertySymbol: Symbol): IMemberInfo {

    const propSignature = propertySymbol.getDeclarations()[0] as PropertySignature;
    const propType = propSignature.getType();
    let requestKind: RequestKind;

    if(propType.isString()) {
      requestKind = RequestKind.string;
    } else if(propType.isNumber()) {
      requestKind = RequestKind.number;
    } else {
      throw new Error('Unsupported field type.');
    }

    const memberInfo: IMemberInfo = {
      name: propertySymbol.getName(),
      request: {
        kind: requestKind
      }
    };
    return memberInfo;
  }
}
