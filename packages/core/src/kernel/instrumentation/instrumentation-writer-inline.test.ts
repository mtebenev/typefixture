import * as ts from 'typescript';
import {InstrumentationWriterInline} from './instrumentation-writer-inline';
import {ITypeRecipe} from '../type-info/itype-recipe';
import {RequestKind} from '../ispecimen-request';
import {TsTestUtils} from '../../test-utils/ts-test-utils';
import {TypeRecipeRequestKind} from '../type-info/itype-recipe-request';
import {ITypeInfo} from '../type-info/itype-info';

test('Should convert primitive fields requests', () => {

  const typeRecipe: ITypeRecipe = {
    fields: [
      {name: 'a', request: {kind: TypeRecipeRequestKind.number}},
      {name: 'b', request: {kind: TypeRecipeRequestKind.string}},
    ]
  };

  const writer = new InstrumentationWriterInline(ts);
  const expression = writer.rewrite({} as ts.CallExpression, {kind: TypeRecipeRequestKind.recipe, value: typeRecipe});
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

test('Should convert nested fields requests', () => {

  const nestedNestedRecipe: ITypeRecipe = {
    fields: [
      {name: 'bx', request: {kind: TypeRecipeRequestKind.number}},
      {name: 'by', request: {kind: TypeRecipeRequestKind.string}}
    ]
  };

  const nestedRecipe: ITypeRecipe = {
    fields: [
      {name: 'ax', request: {kind: TypeRecipeRequestKind.number}},
      {name: 'ay', request: {kind: TypeRecipeRequestKind.string}},
      {name: 'az', request: {kind: TypeRecipeRequestKind.recipe, value: nestedNestedRecipe}}
    ]
  };
  const typeRecipe: ITypeRecipe = {
    fields: [
      {name: 'a', request: {kind: TypeRecipeRequestKind.recipe, value: nestedRecipe}},
    ]
  };

  const writer = new InstrumentationWriterInline(ts);
  const expression = writer.rewrite({} as ts.CallExpression, {kind: TypeRecipeRequestKind.recipe, value: typeRecipe});
  const typeInfo = TsTestUtils.printExpression(ts, expression);

  const expectedNestedNested: ITypeInfo = {
    fields: [
      {name: 'bx', request: {kind: RequestKind.number}},
      {name: 'by', request: {kind: RequestKind.string}}
    ]
  };
  const expectedNested: ITypeInfo = {
    fields: [
      {name: 'ax', request: {kind: RequestKind.number}},
      {name: 'ay', request: {kind: RequestKind.string}},
      {name: 'az', request: {kind: RequestKind.typeInfo, value: expectedNestedNested}}
    ]
  };
  expect(eval(`(${typeInfo})`)).toEqual({
    kind: RequestKind.typeInfo,
    value: {
      fields: [
        {name: 'a', request: {kind: RequestKind.typeInfo, value: expectedNested}},
      ]
    }
  });
});

test('Should create constructor', () => {
  const typeRecipe: ITypeRecipe = {
    className: 'SomeClass',
    fields: []
  };

  const writer = new InstrumentationWriterInline(ts);
  const expression = writer.rewrite({} as ts.CallExpression, {kind: TypeRecipeRequestKind.recipe, value: typeRecipe});
  const typeInfoStr = TsTestUtils.printExpression(ts, expression);

  expect(typeInfoStr).toContain('ctor: SomeClass'); // Cannot eval because SomeClass injected as symbol
});
