import {ISpecimenContext} from './ispecimen-context';
import {ISpecimenRequest} from './ispecimen-request';

export interface ISpecimenBuilder {

  /**
   * Creates a new specimen based on a request.
   * The requested specimen if possible; otherwise a NoSpecimen
   * @param request The request that describes what to create.
   * @param context A context that can be used to create other specimens.
   */
  create(request: ISpecimenRequest, context: ISpecimenContext): any;
}
