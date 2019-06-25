import {Type} from 'ts-morph';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipe} from './itype-recipe';
import {ITypeRecipeContext} from './itype-recipe-context';

/**
 * Builds type recipe based on the TS Type node.
 * Design note: unlike .Net we don't have true RTTI.
 * Thus we have two stages:
 * Source analysis stage: during the source transformation, on this stage we have access to the type info.
 * Runtime stage: during the tests execution we have only information prepared on the source analysis stage.
 */
export interface ITypeRecipeBuilder {
  create(type: Type, context: ITypeRecipeContext): ITypeRecipe | NoTypeInfo;
}
