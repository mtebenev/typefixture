import * as ts from 'typescript';
import {ITypeRecipe} from '../type-info/itype-recipe';

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
  rewrite(callExpression: ts.CallExpression, typeRecipe: ITypeRecipe): ts.Expression;
}
