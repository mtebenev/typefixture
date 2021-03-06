import * as ts from 'typescript';
import {IInstrumentationWriter} from './iinstrumentation-writer';
import {TTypeScript} from './instrumentation-transformer';
import {ITypeRecipe} from '../type-info/itype-recipe';
import {IMemberRecipe} from '../type-info/imember-recipe';
import {TypeRecipeRequestKind, ITypeRecipeRequest} from '../type-info/itype-recipe-request';
import {IMethodRecipe} from '../type-info/imethod-recipe';
import {IArgumentRecipe} from '../type-info/iargument-recipe';

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
  public rewrite(callExpression: ts.CallExpression, typeRecipeRequest: ITypeRecipeRequest): ts.Expression {

    const typeInfoExpression = this.createTypeInfoExpression(typeRecipeRequest);

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
  private createTypeInfoExpression(typeRecipeRequest: ITypeRecipeRequest): ts.Expression {

    const typeInfoAssignments: ts.ObjectLiteralElementLike[] = [];

    if(typeRecipeRequest.kind !== TypeRecipeRequestKind.recipe) {
      throw new Error(`Unsupported type recipe: ${typeRecipeRequest.kind}`);
    }

    const typeRecipe = typeRecipeRequest.value as ITypeRecipe;

    // Fields
    const memberExpressions = typeRecipe.fields.map(f => this.createMemberExpression(f));
    const memberArray = this.compilerModule.createArrayLiteral(memberExpressions);
    const fieldAssignments = this.compilerModule.createPropertyAssignment('fields', memberArray);
    typeInfoAssignments.push(fieldAssignments);

    // Add ctor (symbol) assignment if available
    if(typeRecipe.className) {
      const ctorAssignment = this.createCtorAssignment(typeRecipe.className);
      typeInfoAssignments.push(ctorAssignment);
    }

    // Add ctor info (arguments) assignment if available
    if(typeRecipe.ctor) {
      const ctorInfoAssignment = this.createCtorInfoAssignment(typeRecipe.ctor);
      typeInfoAssignments.push(ctorInfoAssignment);
    }

    const result = this.compilerModule.createObjectLiteral(typeInfoAssignments);

    return result;
  }

  private createCtorAssignment(className: string): ts.PropertyAssignment {
    const ctorIdentifier = this.compilerModule.createIdentifier(className);
    const result = this.compilerModule.createPropertyAssignment(
      'ctor',
      ctorIdentifier);
    return result;
  }

  private createCtorInfoAssignment(methodRecipe: IMethodRecipe): ts.PropertyAssignment {
    const methodInfoExpression = this.createMethodInfoExpression(methodRecipe);
    const result = this.compilerModule.createPropertyAssignment(
      'ctorInfo',
      methodInfoExpression
    );
    return result;
  }

  /**
   * Creates expression for a member.
   */
  private createMemberExpression(memberRecipe: IMemberRecipe): ts.Expression {

    const requestEpxression = this.createSpecimenRequestExpression(memberRecipe.request);
    const requestProperties: ts.PropertyAssignment[] =
      [
        this.compilerModule.createPropertyAssignment('name', this.compilerModule.createLiteral(memberRecipe.name)),
        this.compilerModule.createPropertyAssignment('request', requestEpxression)
      ];
    const result = this.compilerModule.createObjectLiteral(requestProperties);
    return result;
  }

  /**
   * IMethodRecipe -> IMethodInfo expression
   */
  private createMethodInfoExpression(methodRecipe: IMethodRecipe): ts.Expression {
    const propAssignments: ts.PropertyAssignment[] = [];

    // Method name
    const nameExpression = this.compilerModule.createPropertyAssignment('name', this.compilerModule.createLiteral(methodRecipe.name));
    propAssignments.push(nameExpression);
    // Arguments
    const argumentsElements = methodRecipe.arguments.map(a => this.createArgumentExpression(a));
    const argumentsArrayExpression = this.compilerModule.createArrayLiteral(argumentsElements);
    const argumentsExpression = this.compilerModule.createPropertyAssignment('arguments', argumentsArrayExpression);
    propAssignments.push(argumentsExpression);

    const result = this.compilerModule.createObjectLiteral(propAssignments);
    return result;
  }

  /**
   * ITypeRecipeRequest -> ISpecimenRequest expression.
   */
  private createSpecimenRequestExpression(typeRecipeRequest: ITypeRecipeRequest): ts.ObjectLiteralExpression {

    const propAssignments: ts.PropertyAssignment[] = [];
    if(typeRecipeRequest.kind === TypeRecipeRequestKind.number) {
      const kindExpression = this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(0));
      propAssignments.push(kindExpression);
    } else if(typeRecipeRequest.kind === TypeRecipeRequestKind.string) {
      const kindExpression = this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(1));
      propAssignments.push(kindExpression);
    } else if(typeRecipeRequest.kind === TypeRecipeRequestKind.recipe) {
      const kindExpression = this.compilerModule.createPropertyAssignment('kind', this.compilerModule.createLiteral(2));
      propAssignments.push(kindExpression);
      const typeInfoExpressionValue = this.createTypeInfoExpression(typeRecipeRequest);
      const valueExpression = this.compilerModule.createPropertyAssignment('value', typeInfoExpressionValue);
      propAssignments.push(valueExpression);
    } else {
      throw new Error(`Unsupported type recipe request: ${typeRecipeRequest.kind}.`);
    }

    const result = this.compilerModule.createObjectLiteral(propAssignments);
    return result;
  }

  /**
   * IArgumentRecipe -> IArgumentInfo expression
   */
  private createArgumentExpression(argumentRecipe: IArgumentRecipe): ts.Expression {
    const propAssignments: ts.PropertyAssignment[] = [];
    // Argument name
    const nameExpression = this.compilerModule.createPropertyAssignment('name', this.compilerModule.createLiteral(argumentRecipe.name));
    propAssignments.push(nameExpression);
    // Argument request
    const requestExpression = this.createSpecimenRequestExpression(argumentRecipe.typeRecipeRequest);
    const requestAssignment = this.compilerModule.createPropertyAssignment('request', requestExpression);
    propAssignments.push(requestAssignment);

    const result = this.compilerModule.createObjectLiteral(propAssignments);
    return result;
  }
}
