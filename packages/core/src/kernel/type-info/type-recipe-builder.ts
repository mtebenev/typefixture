import {Type} from 'ts-morph';
import {ITypeRecipe} from './itype-recipe';
import {TypeRecipeBuilderClass} from './type-recipe-builder-class';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipeContext} from './itype-recipe-context';

export class TypeRecipeBuilder {

  /**
   * Type recipe builder root.
   */
  public build(type: Type): ITypeRecipe | NoTypeInfo {

    let result = new NoTypeInfo();

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

    return result;
  }
}