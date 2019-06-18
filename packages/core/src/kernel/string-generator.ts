import {ISpecimenBuilder} from './ispecimen-builder';
import {ISpecimenRequest, RequestKind} from './ispecimen-request';
import {ISpecimenContext} from '.';
import {NoSpecimen} from './no-specimen';
import {uuid} from '../utils/uuid';

/**
 * Simple random string generator.
 */
export class StringGenerator implements ISpecimenBuilder {

  /**
   * ISpecimenBuilder
   */
  public create(request: ISpecimenRequest, context: ISpecimenContext): any {
    let result;
    if(request.kind !== RequestKind.string) {
      result = new NoSpecimen();
    } else {
      result = uuid();
    }

    return result;
  }
}
