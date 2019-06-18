import * as ts from 'typescript';
import {SourceProcessorInline} from './source-processor-inline';

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

      console.log('Transforming file: ' + sourceFile.fileName);

      // Find all references and collect type info
      const sourceProcessor = new SourceProcessorInline(this.compilerModule);
      sourceProcessor.processSourceFile(sourceFile);

      // Start transformation
      const result = this.compilerModule.visitNode(
        sourceFile,
        (node) => this.visitNode(node, context, sourceProcessor)
      );

      // OLD
      // const result = this.visitNodeAndChildren(sourceFile, context, sourceProcessor);
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
    console.warn(`VISIT NODE: ${node.getText()}`);
    // OLD
    // return sourceProcessor.rewriteNode(node);
    const newNode = sourceProcessor.rewriteNode(node);
    if(newNode != node) {
      console.warn('RETURN NEW NODE');
      return newNode;
    } else {
      return this.compilerModule.visitEachChild(
        node,
        (node) => this.visitNode(node, ctx, sourceProcessor),
        ctx
      );
    }
  }
}
