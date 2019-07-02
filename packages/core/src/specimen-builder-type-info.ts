import {ISpecimenBuilder, NoSpecimen, ISpecimenContext} from './kernel';
import {ISpecimenRequest, RequestKind} from './kernel/ispecimen-request';
import {ITypeInfo} from './kernel/type-info/itype-info';
import {ITypeInfoStorage} from './kernel/instrumentation/itype-info-storage';

/**
 * Can build specimens according to provided type info.
 */
export class SpecimenBuilderTypeInfo implements ISpecimenBuilder {

  private typeInfoStorage: ITypeInfoStorage;

  constructor(typeInfoStorage: ITypeInfoStorage) {
    this.typeInfoStorage = typeInfoStorage;
  }

  /**
   * ISpecimenBuilder
   */
  public create(request: ISpecimenRequest, context: ISpecimenContext): any {
    let result;
    let typeInfo: ITypeInfo | undefined;

    if(request.kind === RequestKind.typeInfo) {
      typeInfo = request.value;
    } else if(request.kind === RequestKind.typeInfoId) {
      const typeId: string = request.value;
      typeInfo = this.typeInfoStorage.getTypeInfo(typeId);
    }

    if(typeInfo) {
      // Create the specimen with constructor or signature object
      if(typeInfo.ctor) {
        result = this.createObjectInstance(typeInfo, context);
      } else {
        result = {};
      }

      // Fields
      this.buildFields(typeInfo, result, context);
    }

    if(!result) {
      result = new NoSpecimen();
    }

    return result;
  }

  /**
   * Fills the fields in specimen
   */
  private buildFields(typeInfo: ITypeInfo, specimen: any, context: ISpecimenContext): void {
    typeInfo.fields.forEach(f => {
      specimen[f.name] = context.resolve(f.request);
    });
  }

  /**
   * Creates an object instance using ctor and arguments info.
   * TODO: this is PoC implementation with JS approach.
   */
  private createObjectInstance(typeInfo: ITypeInfo, context: ISpecimenContext): any {
    let result: any;
    if(!typeInfo.ctor) {
      throw new Error('Unexpected');
    }

    let args: any[] = [];
    // Create arguments if possible
    if(typeInfo.ctorInfo) {
      args = typeInfo.ctorInfo.arguments.map(a => context.resolve(a.request));
    }
    result = new typeInfo.ctor(...args);

    return result;
  }
}
