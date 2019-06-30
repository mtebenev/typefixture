import * as ts from 'typescript';
import {SourceProcessorInline} from './source-processor-inline';
import {InstrumentationWriterInline} from './instrumentation-writer-inline';
import {IInstrumentationContext} from './iinstrumentation-context';
import {FixtureReferenceFinder} from './fixture-reference-finder';

export type SourceFileTransformer = (sourceFile: ts.SourceFile) => ts.Node;
export type TransformerFunction = (ctx: ts.TransformationContext) => SourceFileTransformer;

export declare type TTypeScript = typeof ts;

/**
 * Integrated into ts-jest pipeline.
 */
export class InstrumentationTransformer {

  private compilerModule: TTypeScript;

  constructor(compilerModule: TTypeScript) {
    this.compilerModule = compilerModule;
  }

  public transform(context: ts.TransformationContext): SourceFileTransformer {
    return (sourceFile: ts.SourceFile) => {

      // Find all references and collect type info
      const instrumentationWriter = new InstrumentationWriterInline(this.compilerModule);
      const fixtureReferenceFinder = new FixtureReferenceFinder(this.compilerModule);

      const instrumentationContext: IInstrumentationContext = {
        instrumentationWriter: instrumentationWriter,
        fixtureReferenceFinder: fixtureReferenceFinder
      };

      const sourceProcessor = new SourceProcessorInline(instrumentationContext);
      sourceProcessor.processSourceFile(sourceFile);

      // Start transformation
      const result = this.compilerModule.visitNode(
        sourceFile,
        node => this.visitNode(node, context, sourceProcessor)
      );

      return result;
    };
  }

  private visitNodeAndChildren(node: ts.Node, ctx: ts.TransformationContext, sourceProcessor: SourceProcessorInline): ts.Node {
    return this.compilerModule.visitEachChild(
      this.visitNode(node, ctx, sourceProcessor),
      childNode => this.visitNodeAndChildren(childNode, ctx, sourceProcessor),
      ctx
    );
  }

  private visitNode(node: ts.Node, ctx: ts.TransformationContext, sourceProcessor: SourceProcessorInline): ts.Node {
    const newNode = sourceProcessor.rewriteNode(node);
    if(newNode !== node) {
      return newNode;
    } else {
      return this.compilerModule.visitEachChild(
        node,
        childNode => this.visitNode(childNode, ctx, sourceProcessor),
        ctx
      );
    }
  }
}
