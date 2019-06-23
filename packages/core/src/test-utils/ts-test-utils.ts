import {Project, Type} from 'ts-morph';

/**
 * TS-related test helpers
 */
export class TsTestUtils {

  /**
   * Compiles the source code and retrieves interface type node.
   */
  public static getInterface(typeName: string, sourceCode: string): Type {
    const project = new Project();
    const sourceFile = project.createSourceFile('source.ts', sourceCode);
    const type = sourceFile.getInterfaceOrThrow(typeName).getType();

    return type;
  }

  /**
   * Compiles the source code and retrieves class type node.
   */
  public static getClass(typeName: string, sourceCode: string): Type {
    const project = new Project();
    const sourceFile = project.createSourceFile('source.ts', sourceCode);
    const type = sourceFile.getClassOrThrow(typeName).getType();

    return type;
  }
}
