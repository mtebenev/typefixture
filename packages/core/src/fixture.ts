import {ISpecimenBuilder, ISpecimenContext} from './kernel';
import {SpecimenBuilderTypeInfo} from './specimen-builder-type-info';
import {TypeInfoStorage} from './kernel/instrumentation/type-info-storage';
import {SpecimenBuilderComposite} from './specimen-builder-composite';
import {SpecimenContext} from './specimen-context';
import {ISpecimenRequest, RequestKind} from './kernel/ispecimen-request';
import {RandomNumericSequenceGenerator} from './kernel/random-numeric-sequence-generator';
import {StringGenerator} from './kernel/string-generator';

export class Fixture {

  private customBuilders: ISpecimenBuilder[];

  constructor() {
    this.customBuilders = [];
  }

  /**
   * Create a single specimen instance
   */
  public create<T>(request?: string): T {
    if(!request) {
      throw new Error('Failed to create specimen: probably instrumentation failed.');
    }
    const context = this.createContext();
    return context.resolve(request);
  }

  /**
   * Creates context with standard configuration
   */
  private createContext(): ISpecimenContext {
    const storage = TypeInfoStorage.getInstance();

    // Compose builders
    const standardBuilders = [
      new RandomNumericSequenceGenerator(),
      new StringGenerator(),
      new SpecimenBuilderTypeInfo(storage)
    ];

    const allBuilders = [...this.customBuilders, ...standardBuilders];

    // Create context
    const rootBuilder = new SpecimenBuilderComposite(allBuilders);
    const context = new SpecimenContext(rootBuilder);

    return context;
  }
}
