import {ISpecimenRequest} from '../ispecimen-request';

/**
 * Provides re-constructed member info from AST
 */
export interface IMemberInfo {

  /**
   * Member name.
   */
  name: string;

  /**
   * The request satisfying the member creation.
   */
  request: ISpecimenRequest;
}
