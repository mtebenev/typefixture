import {CallExpression, TypeChecker, Symbol, PropertySignature} from 'ts-morph';
import {ITypeInfo} from './itype-info';
import {IMemberInfo} from './imember-info';
import {RequestKind} from '../ispecimen-request';

/**
 * Encapsulates logic for type info extraction from mock call (fixture.create(...))
 */
export class TypeInfoBuilder {

  private typeChecker: TypeChecker;

  constructor(typeChecker: TypeChecker) {
    this.typeChecker = typeChecker;
  }

  /**
   * Extracts requested type and creates the type info.
   */
  public build(callExpression: CallExpression): ITypeInfo {
    const typeNode = callExpression.getTypeArguments()[0];
    const targetType = this.typeChecker.getTypeAtLocation(typeNode);
    const props = targetType.getProperties();

    const typeInfo: ITypeInfo = {
      fields: props.map(p => this.createFieldRequest(p))
    };

    return typeInfo;
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
