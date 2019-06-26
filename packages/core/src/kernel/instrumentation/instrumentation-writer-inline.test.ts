import * as ts from 'typescript';
import {InstrumentationWriterInline} from './instrumentation-writer-inline';
import {ITypeRecipe} from '../type-info/itype-recipe';
import {RequestKind} from '../ispecimen-request';
import {TsTestUtils} from '../../test-utils/ts-test-utils';

describe('InstrumentationWriterInline', () => {
  it('Should convert primitive fields requests', () => {

    const typeRecipe: ITypeRecipe = {
      fields: [
        {name: 'a', request: {kind: RequestKind.number}},
        {name: 'b', request: {kind: RequestKind.string}},
      ]
    };

    const writer = new InstrumentationWriterInline(ts);
    const expression = writer.rewrite({} as ts.CallExpression, typeRecipe);
    const typeInfo = TsTestUtils.printExpression(ts, expression);

    expect(eval(`(${typeInfo})`)).toEqual({
      kind: RequestKind.typeInfo,
      value: {
        fields: [
          {name: 'a', request: {kind: RequestKind.number}},
          {name: 'b', request: {kind: RequestKind.string}},
        ]
      }
    });
  });

  it('Should create constructor', () => {
    const typeRecipe: ITypeRecipe = {
      className: 'SomeClass',
      fields: []
    };

    const writer = new InstrumentationWriterInline(ts);
    const expression = writer.rewrite({} as ts.CallExpression, typeRecipe);
    const typeInfoStr = TsTestUtils.printExpression(ts, expression);

    expect(typeInfoStr).toContain('ctor: SomeClass'); // Cannot eval because SomeClass injected as symbol
  });
});
