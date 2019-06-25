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
      // Create the specimen with constructor or signature
      if(typeInfo.ctor) {
        result = new typeInfo.ctor()
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
}
