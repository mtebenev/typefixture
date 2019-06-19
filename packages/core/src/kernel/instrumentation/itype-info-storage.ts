import {ITypeInfo} from './itype-info';

export interface ITypeInfoStorage {
  getTypeInfo(id: string): ITypeInfo | undefined;
}
