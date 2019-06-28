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

  /**
   * Type recipe -> expression with type info
   */
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
   * Creates expression for a member.
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

    const propAssignments: ts.PropertyAssignment[] = [];
    if(memberRecipe.request.kind === TypeRecipeRequestKind.number) {
      const kindExpression = this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(0));
      propAssignments.push(kindExpression);
    } else if(memberRecipe.request.kind === TypeRecipeRequestKind.string) {
      const kindExpression = this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(1));
      propAssignments.push(kindExpression);
    } else if(memberRecipe.request.kind === TypeRecipeRequestKind.recipe) {
      const kindExpression = this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(2));
      propAssignments.push(kindExpression);
      const typeInfoExpressionValue = this.createTypeInfoExpression(memberRecipe.request.value);
      const valueExpression = this.compilerModule.createPropertyAssignment('value', typeInfoExpressionValue);
      propAssignments.push(valueExpression)
    } else {
      throw new Error(`Unsupported type recipe request: ${memberRecipe.request.kind}.`);
    }

    const result = this.compilerModule.createObjectLiteral(propAssignments);
    return result;
  }
}
