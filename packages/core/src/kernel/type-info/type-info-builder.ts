import {Symbol, PropertySignature, Type, ts} from 'ts-morph';
import {ITypeInfo} from './itype-info';
import {IMemberInfo} from './imember-info';
import {RequestKind} from '../ispecimen-request';

/**
 * Encapsulates logic for type info extraction from mock call (fixture.create(...))
 */
export class TypeInfoBuilder {

  /**
   * Extracts requested type and creates the type info.
   */
  public build(type: Type): ITypeInfo {
    const props = type.getProperties();

    const typeInfo: ITypeInfo = {
      fields: []
      // fields: props.map(p => this.createFieldRequest(p))
    };
    // ---------------------------------------------
    // Testing constructor ref here
    const symbol = type.getSymbolOrThrow();
    const members = symbol.getMembers();
    const ctor = members.find(m => m.hasFlags(ts.SymbolFlags.Constructor));
    if(ctor) {
      console.error(`Found CTOR member: ${symbol.getName()}   ${symbol.getFullyQualifiedName()}`);
      typeInfo.ctorId = symbol.getFullyQualifiedName();
    }

    // ----------------------------------------------

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
