import {ISpecimenBuilder, NoSpecimen, ISpecimenContext} from './kernel';
import {ISpecimenRequest, RequestKind} from './kernel/ispecimen-request';

/**
 * Responsible for building primitive type objects like string, boolean etc
 */
export class SpecimenBuilderPrimitive implements ISpecimenBuilder {

  /**
   * ISpecimenBuilder
   */
  public create(request: ISpecimenRequest, context: ISpecimenContext): any {

    let result;
    if(request.kind === RequestKind.string)
      result = 'random string';
    else if(request.kind === RequestKind.number)
      result = 42;
    else
      result = new NoSpecimen();

    return result;
  }
}
