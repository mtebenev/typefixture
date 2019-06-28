import * as ts from 'typescript';
import {IInstrumentationWriter} from './iinstrumentation-writer';
import {TTypeScript} from './instrumentation-transformer';
import {ITypeRecipe} from '../type-info/itype-recipe';
import {IMemberRecipe} from '../type-info/imember-recipe';
import {TypeRecipeRequestKind} from '../type-info/itype-recipe-request';

/**
 * Inline instrumentation
 */
export class InstrumentationWriterInline implements IInstrumentationWriter {

  private compilerModule: TTypeScript;

  constructor(compilerModule: TTypeScript) {
    this.compilerModule = compilerModule;
  }

  /**
   * IInstrumentationWriter
   */
  public rewrite(callExpression: ts.CallExpression, typeRecipe: ITypeRecipe): ts.Expression {

    const typeInfoExpression = this.createTypeInfoExpression(typeRecipe);

    // Create specimen request expression
    const requestProperties: ts.PropertyAssignment[] =
    [
      this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(2)),
      this.compilerModule.createPropertyAssignment('value', typeInfoExpression)
    ];

    const result = this.compilerModule.createObjectLiteral(requestProperties);
    return result;
  }

  private createTypeInfoExpression(typeRecipe: ITypeRecipe): ts.Expression {

    const typeInfoAssignments: ts.ObjectLiteralElementLike[] = [];

    // Fields
    const memberExpressions = typeRecipe.fields.map(f => this.createMemberExpression(f));
    const memberArray = this.compilerModule.createArrayLiteral(memberExpressions);
    const fieldAssignments = this.compilerModule.createPropertyAssignment('fields', memberArray);
    typeInfoAssignments.push(fieldAssignments);

    // Add ctor assignment if available
    if(typeRecipe.className) {
      const ctorAssignment = this.createCtorAssignment(typeRecipe.className);
      typeInfoAssignments.push(ctorAssignment);
    }

    const result =  this.compilerModule.createObjectLiteral(typeInfoAssignments);

    return result;
  }

  private createCtorAssignment(className: string): ts.PropertyAssignment {
    const ctorIdentifier = this.compilerModule.createIdentifier(className);
    const result = this.compilerModule.createPropertyAssignment(
      'ctor',
      ctorIdentifier);
      return result;
  }

  /**
   * Creates
   */
  private createMemberExpression(memberRecipe: IMemberRecipe): ts.Expression {

    let requestEpxression = this.createMemberRequestExpression(memberRecipe);
    const requestProperties: ts.PropertyAssignment[] =
    [
      this.compilerModule.createPropertyAssignment('name', this.compilerModule.createLiteral(memberRecipe.name)),
      this.compilerModule.createPropertyAssignment('request', requestEpxression)
    ];
    const result = this.compilerModule.createObjectLiteral(requestProperties);
    return result;
  }

  private createMemberRequestExpression(memberRecipe: IMemberRecipe): ts.ObjectLiteralExpression {

    let kindExpression: ts.PropertyAssignment;
    if(memberRecipe.request.kind === TypeRecipeRequestKind.number) {
      kindExpression = this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(0));
    } else if(memberRecipe.request.kind === TypeRecipeRequestKind.string) {
      kindExpression = this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(1));
    } else {
      throw new Error('Only primitives supported.');
    }

    const result = this.compilerModule.createObjectLiteral([kindExpression]);
    return result;
  }

}
