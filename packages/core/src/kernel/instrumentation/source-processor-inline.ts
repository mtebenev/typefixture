import {ts} from 'ts-morph';
import {IInstrumentationContext} from './iinstrumentation-context';
import {FixtureCallReference} from './fixture-call-reference';

/**
 * Source processor inlining instrumentation call.
 * Instead of putting the type info into a storage it rewrites reference and puts the type info right into the call.
 * This works with Karma (because Karma launches a browser for test execution and we do not have to cross process boundaries)
 */
export class SourceProcessorInline {

  /**
   * Contains all found references during source file processing.
   */
  private references: FixtureCallReference[];
  private instrumentationContext: IInstrumentationContext;

  constructor(instrumentationContext: IInstrumentationContext) {
    this.references = [];
    this.instrumentationContext = instrumentationContext;
  }

  /**
   * Collects information about all Fixture.create() calls.
   */
  public processSourceFile(sourceFile: ts.SourceFile): void {
    this.references = this.instrumentationContext.fixtureReferenceFinder.findReferences(sourceFile);
  }

  /**
   * Rewrites Fixture.create() call or returns the node unchanged.
   */
  public rewriteNode(node: ts.Node): ts.Node {
    const matchedReference = this.references.find(r => r.match(node));
    return matchedReference ? matchedReference.rewrite(node, this.instrumentationContext.instrumentationWriter) : node;
  }
}
