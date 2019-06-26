import {ts, Project, ClassDeclaration, CallExpression, TypeChecker} from 'ts-morph';
import {TypeRecipeBuilder} from '../type-info/type-recipe-builder';
import {TTypeScript} from './instrumentation-transformer';
import {IInstrumentationWriter} from './iinstrumentation-writer';
import {ITypeRecipe} from '../type-info/itype-recipe';

/**
 * Source processor inlining instrumentation call.
 * Instead of putting the type info into a storage it rewrites reference and puts the type info right into the call.
 * This works with Karma (because Karma launches a browser for test execution and we do not have to cross process boundaries)
 */
export class SourceProcessorInline {

  /**
   * Contains all found references during source file processing.
   */
  private references: Array<{nodePosition: number, typeRecipe: ITypeRecipe}>;
  private compilerModule: TTypeScript;
  private instrumentationWriter: IInstrumentationWriter;

  constructor(compilerModule: TTypeScript, instrumentationWriter: IInstrumentationWriter) {
    this.references = [];
    this.compilerModule = compilerModule;
    this.instrumentationWriter = instrumentationWriter;
  }

  /**
   * Collects information about all Fixture.create() calls.
   */
  public processSourceFile(sourceFile: ts.SourceFile): void {
    const project = new Project({
      addFilesFromTsConfig: false,
    });

    // Try obtain symbol for Fixture.create() and find all references (call expressions)
    const sf = project.addExistingSourceFile(sourceFile.fileName);
    const importDeclaration = sf.getImportDeclaration('@typefixture/core');
    if(importDeclaration) {
      const fixtureClassImport = importDeclaration.getNamedImports().find(i => i.getName() === 'Fixture');
      if(fixtureClassImport) {
        const nameNode = fixtureClassImport.getNameNode();
        const typeChecker = project.getTypeChecker();
        const fixtureType = typeChecker.getTypeAtLocation(nameNode);
        if(fixtureType) {
          const fixtureClassSymbol = fixtureType.getSymbolOrThrow();
          const fixtureClassDeclaration = fixtureClassSymbol.getDeclarations()[0]  as unknown as ClassDeclaration;
          const methodDecl = fixtureClassDeclaration.getMethodOrThrow('create');

          const nodes = methodDecl.findReferencesAsNodes();
          const idNode = nodes[0];
          const resultCallNode = idNode.getFirstAncestorByKind(ts.SyntaxKind.CallExpression)!;

          const nodePosition = resultCallNode.compilerNode.pos;
          const typeRecipe = this.createTypeRecipe(resultCallNode, typeChecker);
          this.references.push({nodePosition, typeRecipe});
        }
      }
    }
  }

  /**
   * Rewrites Fixture.create() call or returns the node unchanged.
   */
  public rewriteNode(node: ts.Node): ts.Node {
    const reference = this.references.find(r => r.nodePosition === node.getFullStart());
    if(reference && this.compilerModule.isCallExpression(node)) {
      console.warn('REWRITE NODE');
      const callExpression: ts.CallExpression = node as ts.CallExpression;
      const newParam = this.instrumentationWriter.rewrite(callExpression, reference.typeRecipe);
      return this.compilerModule.updateCall(callExpression, callExpression.expression, callExpression.typeArguments, [newParam]);
    } else {
      return node;
    }
  }

  /**
   * Creates type info from fixture.create<T>() expression.
   */
  private createTypeRecipe(callExpression: CallExpression, typeChecker: TypeChecker): ITypeRecipe {

    const typeNode = callExpression.getTypeArguments()[0];
    const targetType = typeChecker.getTypeAtLocation(typeNode);
    const recipeBuilder = new TypeRecipeBuilder();
    const typeRecipe = recipeBuilder.build(targetType);
    return typeRecipe;
  }
}
