import {TypeInfoStorage} from './kernel/instrumentation/type-info-storage';
import {inspect} from 'util';

export class MyTestClass {

  public doMe<T>(typeId?: string): T {
    if(!typeId) {
      throw new Error('Instrumentation failed!');
    }

    const storage = TypeInfoStorage.getInstance();

    console.warn(`Getting type: ${typeId}`);
    console.warn(`Current types: ${inspect(storage)}`);

    const typeInfo = storage.getTypeInfo(typeId);

    if(!typeInfo) {
      throw new Error('Cannot find type info!');
    }

    const result: any = {};
    typeInfo.fields.forEach(f => {
      result[f.name] = 10;
    });

    return result;
  }
}
