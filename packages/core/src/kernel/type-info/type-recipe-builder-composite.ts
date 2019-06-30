import {Type} from 'ts-morph';
import {ITypeRecipeBuilder} from './itype-recipe-builder';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipeRequest} from './itype-recipe-request';
import {NoTypeInfo} from './no-type-info';

/**
 * Creates type recipes by returning the first recipe created by its children.
 */
export class TypeRecipeBuilderComposite implements ITypeRecipeBuilder {

  constructor(private readonly builders: ITypeRecipeBuilder[]) {
  }

  /**
   * ITypeRecipeBuilder
   */
  public create(type: Type, context: ITypeRecipeContext): ITypeRecipeRequest | NoTypeInfo {

    let result = new NoTypeInfo();

    for(const builder of this.builders) {
      const resolved = builder.create(type, context);
      if(!(resolved instanceof NoTypeInfo)) {
        result = resolved;
        break;
      }
    }

    return result;
  }
}
