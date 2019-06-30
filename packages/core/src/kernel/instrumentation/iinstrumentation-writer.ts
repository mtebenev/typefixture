import * as ts from 'typescript';
import {ITypeRecipeRequest} from '../type-info/itype-recipe-request';

/**
 * Responsible for rewriting fixture.create() method.
 */
export interface IInstrumentationWriter {

  /**
   * Performs rewrite
   * @param callExpression fixture.create() call expression.
   * @param typeId the type to be instrumented.
   * @returns expression to be written for fixture.create() argument.
   */
  rewrite(callExpression: ts.CallExpression, typeRecipeRequest: ITypeRecipeRequest): ts.Expression;
}
