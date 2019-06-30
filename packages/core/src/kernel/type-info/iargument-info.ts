import {ISpecimenRequest} from '../ispecimen-request';

/**
 * Provides info about a method argument.
 */
export interface IArgumentInfo {

  /**
   * Argument name.
   */
  name: string;

  /**
   * The request satisfying the argument creation.
   */
  request: ISpecimenRequest;
}
