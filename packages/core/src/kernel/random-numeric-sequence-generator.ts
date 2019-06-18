import {ISpecimenBuilder} from './ispecimen-builder';
import {ISpecimenRequest, RequestKind} from './ispecimen-request';
import {ISpecimenContext} from '.';
import {NoSpecimen} from './no-specimen';

/**
 * Random numeric generator.
 */
export class RandomNumericSequenceGenerator implements ISpecimenBuilder {

  private min: number;
  private max: number;

  constructor() {
    this.min = 1;
    this.max = Math.pow(2, 8);
  }

  /**
   * ISpecimenBuilder
   */
  public create(request: ISpecimenRequest, context: ISpecimenContext): any {
    let result;
    if(request.kind !== RequestKind.number) {
      result = new NoSpecimen();
    } else {
      result = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }
    return result;
  }
}
