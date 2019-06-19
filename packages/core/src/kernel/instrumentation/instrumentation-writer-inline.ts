import * as ts from 'typescript';
import {IInstrumentationWriter} from './iinstrumentation-writer';
import {ITypeInfoStorage} from './itype-info-storage';
import {TTypeScript} from './instrumentation-transformer';
import {ITypeInfo} from './itype-info';
import {IMemberInfo} from './imember-info';
import {RequestKind} from '../ispecimen-request';

/**
 * Inline instrumentation
 */
export class InstrumentationWriterInline implements IInstrumentationWriter {

  private typeInfoStorage: ITypeInfoStorage;
  private compilerModule: TTypeScript;

  constructor(compilerModule: TTypeScript, typeInfoStorage: ITypeInfoStorage) {
    this.compilerModule = compilerModule;
    this.typeInfoStorage = typeInfoStorage;
  }

  /**
   * IInstrumentationWriter
   */
  public rewrite(callExpression: ts.CallExpression, typeId: string): ts.Expression {

    const typeInfo = this.typeInfoStorage.getTypeInfo(typeId);
    if(!typeInfo) {
      throw new Error('Cannot find type info.');
    }
    const typeInfoExpression = this.createTypeInfoExpression(typeInfo);

    // Create specimen request expression
    const requestProperties: ts.PropertyAssignment[] =
    [
      this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(2)),
      this.compilerModule.createPropertyAssignment('value', typeInfoExpression)
    ];

    const result = this.compilerModule.createObjectLiteral(requestProperties);
    return result;
  }

  private createTypeInfoExpression(typeInfo: ITypeInfo): ts.Expression {

    const memberExpressions = typeInfo.fields.map(f => this.createMemberExpression(f));
    const memberArray = this.compilerModule.createArrayLiteral(memberExpressions);

    const typeInfoAssignments = this.compilerModule.createPropertyAssignment('fields', memberArray)
    const result =  this.compilerModule.createObjectLiteral([typeInfoAssignments]);

    return result;
  }

  /**
   * Creates
   */
  private createMemberExpression(memberInfo: IMemberInfo): ts.Expression {

    let requestEpxression = this.createMemberRequestExpression(memberInfo);
    const requestProperties: ts.PropertyAssignment[] =
    [
      this.compilerModule.createPropertyAssignment('name', this.compilerModule.createLiteral(memberInfo.name)),
      this.compilerModule.createPropertyAssignment('request', requestEpxression)
    ];
    const result = this.compilerModule.createObjectLiteral(requestProperties);
    return result;
  }

  private createMemberRequestExpression(memberInfo: IMemberInfo): ts.ObjectLiteralExpression {

    let kindExpression: ts.PropertyAssignment;
    if(memberInfo.request.kind === RequestKind.number) {
      kindExpression = this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(0));
    } else if(memberInfo.request.kind === RequestKind.string) {
      kindExpression = this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(1));
    } else {
      throw new Error('Only primitives supported.');
    }

    const result = this.compilerModule.createObjectLiteral([kindExpression]);
    return result;
  }

}
