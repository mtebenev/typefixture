import {ISpecimenBuilder, ISpecimenContext, IRequestSpecificationn, NoSpecimen} from './kernel';

/**
 * Uses a request specification to filter requests
 */
export class SpecimenBuilderFiltering implements ISpecimenBuilder {

  constructor(private builder: ISpecimenBuilder, private specification: IRequestSpecificationn) {
  }

  /**
   * ISpecimenBuilder
   */
  public create(request: any, context: ISpecimenContext): any {

    const result = this.specification.isSatisfiedBy(request)
      ? this.builder.create(request, context)
      : new NoSpecimen();

    return result;
  }
}
