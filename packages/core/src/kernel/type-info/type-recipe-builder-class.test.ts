import {TsTestUtils} from '../../test-utils/ts-test-utils';
import {NoTypeInfo} from './no-type-info';
import {TypeRecipeBuilderClass} from './type-recipe-builder-class';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipeRequest, TypeRecipeRequestKind} from './itype-recipe-request';

test('Should return NoTypeInfo for interfaces', () => {
  const type = TsTestUtils.getInterface(
    'ISimple',
    `
interface ISimple {
}
`    );

  const builder = new TypeRecipeBuilderClass();
  const typeRecipe = builder.create(type, {} as ITypeRecipeContext);
  expect(typeRecipe).toBeInstanceOf(NoTypeInfo);
});

test('Should create type recipe for classes', () => {
  const type = TsTestUtils.getClass(
    'TestClass',
    `
class TestClass {
}
`    );

  const expectedRequest: ITypeRecipeRequest = {
    kind: TypeRecipeRequestKind.recipe,
    value: {
      className: 'TestClass',
      fields: []
    }
  };

  const builder = new TypeRecipeBuilderClass();
  const typeRecipe = builder.create(type, {} as ITypeRecipeContext);
  expect(typeRecipe).toEqual(expectedRequest);
});

test('Should create info for explicit constructor', () => {
  const type = TsTestUtils.getClass(
    'TestClass',
    `
class TestClass {
  constructor(a: number, b: number) {}
}
`    );

  const expectedRequest: ITypeRecipeRequest = {
    kind: TypeRecipeRequestKind.recipe,
    value: {
      fields: [],
      className: 'TestClass',
      ctor: {
        name: 'ctor',
        arguments: [
          {name: 'a', typeRecipeRequest: {kind: TypeRecipeRequestKind.number}},
          {name: 'b', typeRecipeRequest: {kind: TypeRecipeRequestKind.number}},
        ]
      }
    }
  };

  const nestedRecipeRequest: ITypeRecipeRequest = {kind: TypeRecipeRequestKind.number};
  const mockContext: Partial<ITypeRecipeContext> = {
    resolveTypeOrThrow: jest.fn(() => nestedRecipeRequest)
  };

  const builder = new TypeRecipeBuilderClass();
  const typeRecipe = builder.create(type, mockContext as ITypeRecipeContext);
  expect(typeRecipe).toEqual(expectedRequest);
});
