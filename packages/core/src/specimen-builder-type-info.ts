import {ISpecimenBuilder, NoSpecimen, ISpecimenContext} from './kernel';
import {ISpecimenRequest, RequestKind} from './kernel/ispecimen-request';
import {TypeInfoStorage} from './kernel/instrumentation/type-info-storage';
import {ITypeInfo} from './kernel/instrumentation/itype-info';

/**
 * Can build specimens according to provided type info.
 */
export class SpecimenBuilderTypeInfo implements ISpecimenBuilder {

  private typeInfoStorage: TypeInfoStorage;

  constructor(typeInfoStorage: TypeInfoStorage) {
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
      result = this.buildSpecimen(typeInfo, context);
    }

    if(!result) {
      result = new NoSpecimen();
    }

    return result;
  }

  /**
   * Builds specimen by given type info
   */
  private buildSpecimen(typeInfo: ITypeInfo, context: ISpecimenContext): any {
    const result: any = {};
    typeInfo.fields.forEach(f => {
      result[f.name] = context.resolve(f.request);
    });

    return result;
  }
}
