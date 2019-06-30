import {IArgumentInfo} from './iargument-info';

/**
 * Run-time information about a method.
 */
export interface IMethodInfo {

  /**
   * The method name.
   */
  name: string;

  /**
   * The method argument.
   */
  arguments: IArgumentInfo[];
}
