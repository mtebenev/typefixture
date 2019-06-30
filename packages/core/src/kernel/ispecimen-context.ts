import {ISpecimenRequest} from './ispecimen-request';

/**
 * A context used to create anonymous variables (specimens).
 */
export interface ISpecimenContext {

  /**
   * Creates an anonymous variable (specimen) based on a request.
   * @param request The request that describes what to create.
   */
  resolve(request: ISpecimenRequest): any;
}
