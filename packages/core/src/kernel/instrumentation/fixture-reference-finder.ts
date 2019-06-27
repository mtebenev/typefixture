import {ts, Project, ClassDeclaration, CallExpression, TypeChecker} from 'ts-morph';
import {IFixtureReferenceFinder} from './ifixture-reference-finder';
import {FixtureCallReference} from './fixture-call-reference';
import {TTypeScript} from './instrumentation-transformer';

/**
 * Reference finder default implementation.
 */
export class FixtureReferenceFinder implements IFixtureReferenceFinder {

  private readonly compilerModule: TTypeScript;

  constructor(compilerModule: TTypeScript) {
    this.compilerModule = compilerModule;
  }

  /**
   * IFixtureReferenceFinder
   */
  public findReferences(sourceFile: ts.SourceFile): FixtureCallReference[] {
    let result: FixtureCallReference[] = [];

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
          const fixtureClassDeclaration = fixtureClassSymbol.getDeclarations()[0] as unknown as ClassDeclaration;
          const methodDecl = fixtureClassDeclaration.getMethodOrThrow('create');

          const nodes = methodDecl.findReferencesAsNodes();
          result = nodes.map(n => {
            const callExp = n.getFirstAncestorByKindOrThrow(ts.SyntaxKind.CallExpression);
            return new FixtureCallReference(this.compilerModule, callExp, typeChecker);
          });
        }
      }
    }

    return result;
  }
}
