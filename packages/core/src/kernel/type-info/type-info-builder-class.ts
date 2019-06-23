import {Type, TypeGuards} from 'ts-morph';
import {ITypeInfoBuilder} from './itype-info-builder';
import {NoTypeInfo} from './no-type-info';
import {ITypeInfoContext} from './itype-info-context';
import {ITypeInfo} from './itype-info';

/**
 * Can build type info for a class.
 */
export class TypeInfoBuilderClass implements ITypeInfoBuilder {

  /**
   * ITypeInfoBuilder
.   */
  public create(type: Type, context: ITypeInfoContext): ITypeInfo | NoTypeInfo {

    // Check if the type is a class
    let result = new NoTypeInfo();
    const symbol = type.getSymbol();
    if(symbol) {
      const isClass = symbol.getDeclarations().some(d => TypeGuards.isClassDeclaration(d));
      if(isClass) {
        result = {} as ITypeInfo;
      }
    }

    return result;
  }
}
