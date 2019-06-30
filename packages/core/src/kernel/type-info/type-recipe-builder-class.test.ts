import {TsTestUtils} from '../../test-utils/ts-test-utils';
import {NoTypeInfo} from './no-type-info';
import {TypeRecipeBuilderClass} from './type-recipe-builder-class';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipeRequest, TypeRecipeRequestKind} from './itype-recipe-request';

describe('TypeRecipeBuilderClass', () => {
  it('Should return NoTypeInfo for interfaces', () => {
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

  it('Should create type recipe for classes', () => {
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
});
