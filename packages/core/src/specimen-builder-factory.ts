import {ISpecimenBuilder} from './kernel/ispecimen-builder';
import {ISpecimenContext} from './kernel/ispecimen-context';

/**
 * Uses a function to create a specimen
 */
export class SpecimenBuilderFactory<T> implements ISpecimenBuilder {

  constructor(private factory: () => T) {
  }

  /**
   * ISpecimenBuilder
   */
  public create(request: any, context: ISpecimenContext): any {
    return this.factory();
  }
}
