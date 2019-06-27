import {ts} from 'ts-morph';
import {FixtureCallReference} from './fixture-call-reference';

/**
 * Responsible for finding AST nodes invoking fixture.create().
 */
export interface IFixtureReferenceFinder {

  /**
   * Finds all references for fixture.create() calls.
   */
  findReferences(sourceFile: ts.SourceFile): FixtureCallReference[];
}
