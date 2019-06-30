import {ISpecimenContext, ISpecimenBuilder} from './kernel';
import {ISpecimenRequest} from './kernel/ispecimen-request';

export class SpecimenContext implements ISpecimenContext {

  constructor(private readonly builder: ISpecimenBuilder) {
  }

  /**
   * ISpecimenContext
   */
  public resolve(request: ISpecimenRequest): any {
    return this.builder.create(request, this);
  }
}
