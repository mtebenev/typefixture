import {ts, Project, ClassDeclaration, CallExpression, TypeChecker} from 'ts-morph';
import {TypeInfoStorage} from './type-info-storage';
import {TypeInfoBuilder} from './type-info-builder';

/**
 * Processes source files and performs instrumentation.
 */
export class SourceProcessor {

  /**
   * Contains all found references during source file processing.
   */
  private references: Array<{nodePosition: number, typeId: string}>;

  constructor() {
    this.references = [];
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
    const importDeclaration = sf.getImportDeclaration('typefixture');
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
    if(reference && ts.isCallExpression(node)) {
      const callExpression: ts.CallExpression = node as ts.CallExpression;
      const newParam = ts.createLiteral(reference.typeId);
      return ts.updateCall(callExpression, callExpression.expression, callExpression.typeArguments, [newParam]);
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
}
