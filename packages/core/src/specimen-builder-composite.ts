import {ISpecimenBuilder, ISpecimenContext, NoSpecimen} from './kernel';

/**
 * Creates specimens by returning the first specimen created by its children.
 */
export class SpecimenBuilderComposite implements ISpecimenBuilder {

  constructor(private readonly builders: ISpecimenBuilder[]) {
  }

  /**
   * ISpecimenBuilder
   */
  public create(request: any, context: ISpecimenContext): any {

    let result = new NoSpecimen();

    for(const builder of this.builders) {
      const resolved = builder.create(request, context);
      if(!(resolved instanceof NoSpecimen)) {
        result = resolved;
        break;
      }
    }

    return result;
  }
}
