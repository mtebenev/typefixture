import {TsTestUtils} from '../../test-utils/ts-test-utils';
import {NoTypeInfo} from './no-type-info';
import {TypeRecipeBuilderClass} from './type-recipe-builder-class';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipe} from './itype-recipe';

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

  it('Should create type info for classes', () => {
    const type = TsTestUtils.getClass(
      'TestClass',
      `
class TestClass {
}
`    );

    const builder = new TypeRecipeBuilderClass();
    const typeRecipe = builder.create(type, {} as ITypeRecipeContext);
    expect(typeRecipe).toEqual({
      className: 'TestClass'
    });
  });
});
