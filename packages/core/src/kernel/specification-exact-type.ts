import {Constructor} from '../utils/type';
import {IRequestSpecificationn} from './irequest-specification';

/**
 * The specification matches the request type to a given one
 */
export class SpecificationExactType implements IRequestSpecificationn {

  constructor(private type: Constructor<any>) {
  }

  /**
   * IRequestSpecification
   */
  public isSatisfiedBy(request: any): boolean {
    return request === this.type;
  }
}
