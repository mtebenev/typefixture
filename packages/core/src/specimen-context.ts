import {ISpecimenContext, ISpecimenBuilder} from './kernel';

export class SpecimenContext implements ISpecimenContext {

  constructor(private readonly builder: ISpecimenBuilder) {
  }

  /**
   * ISpecimenContext
   */
  public resolve(request: any): any {
    return this.builder.create(request, this);
  }
}
