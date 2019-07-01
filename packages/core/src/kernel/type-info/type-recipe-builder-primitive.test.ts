import {TsTestUtils} from '../../test-utils/ts-test-utils';
import {ITypeRecipeRequest, TypeRecipeRequestKind} from './itype-recipe-request';
import {TypeRecipeBuilderPrimitive} from './type-recipe-builder-primitive';
import {ITypeRecipeContext} from './itype-recipe-context';

test('Should create type recipe for strings', () => {
  const type = TsTestUtils.getVariableType(
    'a',
    `
let a = 'some string';
    `
  );

  const expectedRequest: ITypeRecipeRequest = {
    kind: TypeRecipeRequestKind.string
  };

  const builder = new TypeRecipeBuilderPrimitive();
  const typeRecipe = builder.create(type, {} as ITypeRecipeContext);
  expect(typeRecipe).toEqual(expectedRequest);
});

test('Should create type recipe for numbers', () => {
  const type = TsTestUtils.getVariableType(
    'a',
    `
let a = 100;
    `
  );

  const expectedRequest: ITypeRecipeRequest = {
    kind: TypeRecipeRequestKind.number
  };

  const builder = new TypeRecipeBuilderPrimitive();
  const typeRecipe = builder.create(type, {} as ITypeRecipeContext);
  expect(typeRecipe).toEqual(expectedRequest);
});
