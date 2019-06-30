import {IMemberInfo} from './imember-info';
import {IMethodInfo} from './imethod-info';

/**
 * Provides re-constructed type info from AST
 */
export interface ITypeInfo {

  /**
   * Public fields info.
   */
  fields: IMemberInfo[];

  /**
   * If defined, then the type is instantiable with new operator.
   */
  ctor?: new() => any;

  /**
   * Provides ctor arguments info if defined.
   */
  ctorInfo?: IMethodInfo;
}
