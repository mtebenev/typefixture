import {TsTestUtils} from '../../test-utils/ts-test-utils';
import {TypeTraitBuilderConstructors} from './type-trait-builder-constructors';
import {ITypeRecipe} from './itype-recipe';
import {IMethodRecipe} from './imethod-recipe';
import {ITypeRecipeRequest} from './itype-recipe-request';
import {ITypeRecipeContext} from './itype-recipe-context';

test('Should ignore default constructor', () => {
  const type = TsTestUtils.getClass(
    'TestClass',
    `
class TestClass {
  constructor() {}
}
`    );

  const builder = new TypeTraitBuilderConstructors({} as ITypeRecipeContext);
  const typeRecipe = {} as ITypeRecipe;
  builder.build(type, typeRecipe);

  expect(typeRecipe.ctor).toBeUndefined();
});

test('Should create constructor info.', () => {
  const type = TsTestUtils.getClass(
    'TestClass',
`
class TestClass {
  constructor(a: number) {}
}
`
  );

  const argumentRequest = {} as ITypeRecipeRequest;
  const mockContext: Partial<ITypeRecipeContext> = {
    resolveTypeOrThrow: jest.fn(() => argumentRequest)
  };

  const builder = new TypeTraitBuilderConstructors(mockContext as ITypeRecipeContext);
  const typeRecipe = {} as ITypeRecipe;
  builder.build(type, typeRecipe);

  const expectedCtor: IMethodRecipe = {
    name: 'ctor',
    arguments: [
      {name: 'a', typeRecipeRequest: argumentRequest}
    ]
  }
  expect(typeRecipe.ctor).toEqual(expectedCtor);
});
