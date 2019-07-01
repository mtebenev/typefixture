import * as ts from 'typescript';
import {InstrumentationTransformer} from '@typefixture/core';

type SourceFileTransformer = (sourceFile: ts.SourceFile) => ts.Node;
type TransformerFunction = (ctx: ts.TransformationContext) => SourceFileTransformer;

/**
 * Creates instrumentation transformer for Angular.
 */
export class TransformerFactoryAngular {
  // TODO: any -> TTypeScript
  public static create(compilerModule: any): TransformerFunction {
    return (ctx: ts.TransformationContext) => {
      const transformer = new InstrumentationTransformer(compilerModule);
      return transformer.transform(ctx);
    };
  }
}
