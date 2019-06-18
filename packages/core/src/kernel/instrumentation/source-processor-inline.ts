import {ts, Project, ClassDeclaration, CallExpression, TypeChecker} from 'ts-morph';
import {TypeInfoStorage} from './type-info-storage';
import {TypeInfoBuilder} from './type-info-builder';
import {TTypeScript} from './instrumentation-transformer';

/**
 * Source processor inlining instrumentation call.
 * Instead of putting the type info into a storage it rewrites reference and puts the type info right into the call.
 * This works with Karma (because Karma launches a browser for test execution and we do not have to cross process boundaries)
 */
export class SourceProcessorInline {

  /**
   * Contains all found references during source file processing.
   */
  private references: Array<{nodePosition: number, typeId: string}>;
  private compilerModule: TTypeScript;

  constructor(compilerModule: TTypeScript) {
    this.references = [];
    this.compilerModule = compilerModule;
  }

  /**
   * Collects information about all Fixture.create() calls.
   */
  public processSourceFile(sourceFile: ts.SourceFile): void {
    console.error('processSourceFile(): ' + sourceFile.fileName);
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
          console.warn('processSourceFile(): FOUND FIXTURE TYPE');
          const fixtureClassSymbol = fixtureType.getSymbolOrThrow();
          const fixtureClassDeclaration = fixtureClassSymbol.getDeclarations()[0]  as unknown as ClassDeclaration;
          const methodDecl = fixtureClassDeclaration.getMethodOrThrow('create');

          const nodes = methodDecl.findReferencesAsNodes();
          const idNode = nodes[0];
          const resultCallNode = idNode.getFirstAncestorByKind(ts.SyntaxKind.CallExpression)!;

          const nodePosition = resultCallNode.compilerNode.pos;
          const typeId = this.createTypeInfo(resultCallNode, typeChecker);
          this.references.push({nodePosition, typeId});
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
      const newParam = this.createTypeInfoNode(reference.typeId);
      return this.compilerModule.updateCall(callExpression, callExpression.expression, callExpression.typeArguments, [newParam]);
    } else {
      return node;
    }
  }

  /**
   * Creates type info from fixture.create<T>() expression.
   */
  private createTypeInfo(callExpression: CallExpression, typeChecker: TypeChecker): string {
    const builder = new TypeInfoBuilder(typeChecker);
    const typeInfo = builder.build(callExpression);
    const storage = TypeInfoStorage.getInstance();
    const typeId = storage.addTypeInfo(typeInfo);
    return typeId;
  }

  private createTypeInfoNode(typeId: string): ts.Expression {
    console.warn('createTypeInfoNode() START');

    const typeInfo = TypeInfoStorage.getInstance().getTypeInfo(typeId);

    const properties = typeInfo!.fields.map(f => {
      const initializer = this.compilerModule.createLiteral(10);
      return this.compilerModule.createPropertyAssignment(f.name, initializer);
    });

    const result = this.compilerModule.createObjectLiteral(properties, false);
    console.warn('createTypeInfoNode() FINISH');

    return result;

  }
}
