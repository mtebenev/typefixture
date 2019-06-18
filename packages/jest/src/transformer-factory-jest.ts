import * as ts from 'typescript';
import {ConfigSet} from 'ts-jest/dist/config/config-set';
import {InstrumentationTransformer} from '@typefixture/core';

type SourceFileTransformer = (sourceFile: ts.SourceFile) => ts.Node;
type TransformerFunction = (ctx: ts.TransformationContext) => SourceFileTransformer;

/**
 * ts-jest API
 */
export const name = 'typefixture-transformer';

// ts-jest API, increment this each time the code is modified
/**
 * @internal
 */
export const version = 1;

/**
 * The factory of transformer factory
 * @param cs Current jest configuration-set
 */
export function factory(cs: ConfigSet): TransformerFunction {
  return (ctx: ts.TransformationContext) => {
    const transformer = new InstrumentationTransformer(cs.compilerModule);
    return transformer.transform(ctx);
  };
}
