import {ITypeInfo} from './itype-info';

/**
 * The context available during build stage.
 */
export interface ITypeInfoContext {
  resolve(): ITypeInfo;
}
