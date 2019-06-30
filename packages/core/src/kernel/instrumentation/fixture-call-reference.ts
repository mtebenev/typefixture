import {CallExpression, ts, TypeChecker} from 'ts-morph';
import {TTypeScript} from './instrumentation-transformer';
import {TypeRecipeBuilder} from '../type-info/type-recipe-builder';
import {IInstrumentationWriter} from './iinstrumentation-writer';
import {ITypeRecipeRequest} from '../type-info/itype-recipe-request';

/**
 * Encapsulates info about reference to fixture.create() call.
 */
export class FixtureCallReference {

  private callExpression: CallExpression;
  private compilerModule: TTypeScript;
  private typeChecker: TypeChecker;

  constructor(compilerModule: TTypeScript, callExpression: CallExpression, typeChecker: TypeChecker) {
    this.callExpression = callExpression;
    this.compilerModule = compilerModule;
    this.typeChecker = typeChecker;
  }

  /**
   * Checks if the given node matches to the reference.
   * @param node A node in source file.
   */
  public match(node: ts.Node): boolean {
    const result = this.callExpression.compilerNode.pos === node.getFullStart()
      && this.compilerModule.isCallExpression(node)
      ? true
      : false;

    return result;
  }

  /**
   * Performs type info rewrite for the node.
   */
  public rewrite(node: ts.Node, instrumentationWriter: IInstrumentationWriter): ts.Node {
    const callExpression: ts.CallExpression = node as ts.CallExpression;
    const typeRecipe = this.createTypeRecipeRequest();
    const newParam = instrumentationWriter.rewrite(callExpression, typeRecipe);
    return this.compilerModule.updateCall(callExpression, callExpression.expression, callExpression.typeArguments, [newParam]);
  }

  /**
   * Creates type recipe from fixture.create<T>() expression.
   */
  private createTypeRecipeRequest(): ITypeRecipeRequest {
    const typeNode = this.callExpression.getTypeArguments()[0];
    const targetType = this.typeChecker.getTypeAtLocation(typeNode);
    const recipeBuilder = new TypeRecipeBuilder();
    const typeRecipeRequest = recipeBuilder.build(targetType);
    return typeRecipeRequest;
  }
}
