import {Type} from 'ts-morph';
import {ITypeRecipe} from './itype-recipe';
import {TypeRecipeBuilderClass} from './type-recipe-builder-class';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipeContext} from './itype-recipe-context';

export class TypeRecipeBuilder {

  /**
   * Type recipe builder root.
   */
  public build(type: Type): ITypeRecipe {

    let result: ITypeRecipe | undefined;

    const builders = [
      new TypeRecipeBuilderClass()
    ];

    for(const builder of builders) {
      const resolved = builder.create(type, {} as ITypeRecipeContext);
      if(!(resolved instanceof NoTypeInfo)) {
        result = resolved;
        break;
      }
    }

    if(!result) {
      throw new Error('Cannot build type recipe.');
    }

    return result;
  }
}
