import {TsTestUtils} from '../../test-utils/ts-test-utils';
import {TypeTraitBuilderFields} from './type-trait-builder-fields';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipe} from './itype-recipe';
import {TypeRecipeRequestKind} from './itype-recipe-request';

describe('TypeTraitBuilderFields', () => {
  it('Should create primitive fields', () => {

    const type = TsTestUtils.getInterface(
      'ITest',
      `
      interface ITest {
        a: number;
        b: string;
      }
`
    );

    const context = {} as ITypeRecipeContext;
    const builder = new TypeTraitBuilderFields(context);

    const typeRecipe = {} as ITypeRecipe;
    builder.build(type, typeRecipe);

    expect(typeRecipe.fields.length).toEqual(2);
    expect(typeRecipe.fields).toContainEqual({
      name: 'a',
      request: {kind: TypeRecipeRequestKind.number}
    });
    expect(typeRecipe.fields).toContainEqual({
      name: 'b',
      request: {kind: TypeRecipeRequestKind.string}
    });
  });

  it('Should create nested interface fields', () => {

    const type = TsTestUtils.getInterface(
      'ITest',
      `
      interface INested {
      }
      interface ITest {
        a: INested;
      }
`    );

    const nestedRecipe = {};
    const context: Partial<ITypeRecipeContext> = {
      resolveType: jest.fn(() => {return nestedRecipe as ITypeRecipe})
    };
    const builder = new TypeTraitBuilderFields(context as ITypeRecipeContext);

    const typeRecipe = {} as ITypeRecipe;
    builder.build(type, typeRecipe);

    expect(typeRecipe.fields.length).toEqual(1);
    expect(typeRecipe.fields).toContainEqual({
      name: 'a',
      request: {kind: TypeRecipeRequestKind.recipe, value: nestedRecipe}
    });
  });
});
