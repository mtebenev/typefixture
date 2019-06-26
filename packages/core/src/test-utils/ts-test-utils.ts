import {Project, Type, ts} from 'ts-morph';
import {TTypeScript} from '../kernel/instrumentation/instrumentation-transformer';

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

  /**
   * Prints a TS expression
   */
  public static printExpression(compilerModule: TTypeScript, expression: ts.Expression): any {
    const printer = compilerModule.createPrinter();
    const sourceFile = compilerModule.createSourceFile('dummy.ts', '', compilerModule.ScriptTarget.Latest, undefined);
    const result = printer.printNode(compilerModule.EmitHint.Expression, expression, sourceFile);

    return result;
  }
}
