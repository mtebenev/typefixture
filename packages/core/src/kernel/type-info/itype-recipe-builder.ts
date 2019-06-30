import {Type} from 'ts-morph';
import {NoTypeInfo} from './no-type-info';
import {ITypeRecipeContext} from './itype-recipe-context';
import {ITypeRecipeRequest} from './itype-recipe-request';

/**
 * Builds type recipe based on the TS Type node.
 * Design note: unlike .Net we don't have true RTTI.
 * Thus we have two stages:
 * Source analysis stage: during the source transformation, on this stage we have access to the type info.
 * Runtime stage: during the tests execution we have only information prepared on the source analysis stage.
 */
export interface ITypeRecipeBuilder {
  create(type: Type, context: ITypeRecipeContext): ITypeRecipeRequest | NoTypeInfo;
}
