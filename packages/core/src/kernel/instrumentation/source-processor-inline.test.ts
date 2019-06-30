import * as ts from 'typescript';
import {SourceProcessorInline} from './source-processor-inline';
import {IInstrumentationContext} from './iinstrumentation-context';
import {IFixtureReferenceFinder} from './ifixture-reference-finder';
import {IInstrumentationWriter} from './iinstrumentation-writer';
import {FixtureCallReference} from './fixture-call-reference';

jest.mock('./fixture-reference-finder');

test('Should rewrite matched nodes', () => {

  // Arrange
  const mockMatchedNode: ts.Node = {} as ts.Node;
  const mockRewrittenNode: ts.Node = {} as ts.Node;

  const mockCallReference: Partial<FixtureCallReference> = {
    match: jest.fn(node => node === mockMatchedNode ? true : false),
    rewrite: jest.fn(() => mockRewrittenNode),
  };

  const mockFrf: IFixtureReferenceFinder = {
    findReferences: jest.fn(() => [
      mockCallReference as FixtureCallReference
    ])
  };

  const context: IInstrumentationContext = {
    fixtureReferenceFinder: mockFrf,
    instrumentationWriter: {} as IInstrumentationWriter
  };

  // Act
  const processor = new SourceProcessorInline(context);
  processor.processSourceFile({} as ts.SourceFile);

  // Verify
  expect(processor.rewriteNode(mockMatchedNode)).toStrictEqual(mockRewrittenNode);
});

test('Should keep non-matched nodes', () => {

  // Arrange
  const mockNode: ts.Node = {} as ts.Node;

  const mockFrf: IFixtureReferenceFinder = {
    findReferences: jest.fn(() => []) // 'No references found'
  };

  const context: IInstrumentationContext = {
    fixtureReferenceFinder: mockFrf,
    instrumentationWriter: {} as IInstrumentationWriter
  };

  // Act
  const processor = new SourceProcessorInline(context);
  processor.processSourceFile({} as ts.SourceFile);

  // Verify
  expect(processor.rewriteNode(mockNode)).toStrictEqual(mockNode);
});
