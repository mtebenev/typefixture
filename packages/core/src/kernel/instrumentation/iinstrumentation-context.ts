import {IInstrumentationWriter} from './iinstrumentation-writer';
import {IFixtureReferenceFinder} from './ifixture-reference-finder';

/**
 * Defines the context services available during instrumentation.
 */
export interface IInstrumentationContext {
  readonly instrumentationWriter: IInstrumentationWriter;
  readonly fixtureReferenceFinder: IFixtureReferenceFinder;
}
