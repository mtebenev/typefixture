import {IMemberInfo} from './imember-info';

/**
 * Provides re-constructed type info from AST
 */
export interface ITypeInfo {

  /**
   * Public fields info.
   */
  fields: IMemberInfo[];
}
