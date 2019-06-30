import {TsTestUtils} from '../../test-utils/ts-test-utils';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipeContext} from './itype-recipe-context';
import {TypeRecipeBuilderInterface} from './type-recipe-builder-interface';
import {ITypeRecipeRequest, TypeRecipeRequestKind} from './itype-recipe-request';

test('Should create type recipe for classes', () => {
  const type = TsTestUtils.getInterface(
    'ISimple',
    `
interface ISimple {
}
`
  );

  const expectedRequest: ITypeRecipeRequest = {
    kind: TypeRecipeRequestKind.recipe,
    value: {
      fields: []
    }
  };

  const builder = new TypeRecipeBuilderInterface();
  const typeRecipe = builder.create(type, {} as ITypeRecipeContext);
  expect(typeRecipe).toEqual(expectedRequest);
});

test('Should return NoTypeInfo for classes', () => {
  const type = TsTestUtils.getClass(
    'TestClass',
    `
class TestClass {
}
`    );

  const builder = new TypeRecipeBuilderInterface();
  const typeRecipe = builder.create(type, {} as ITypeRecipeContext);
  expect(typeRecipe).toBeInstanceOf(NoTypeInfo);
});
