import {ITypeInfo} from '../type-info/itype-info';

export interface ITypeInfoStorage {
  getTypeInfo(id: string): ITypeInfo | undefined;
}
