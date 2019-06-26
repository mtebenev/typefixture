import {ITypeInfo} from '../type-info/itype-info';
import {uuid} from '../../utils/uuid';

/**
 * Contains all type information collected from AST.
 */
export class TypeInfoStorage {

  private storage: Map<string, ITypeInfo>;

  public static getInstance(): TypeInfoStorage {
    if(!(global as any).__typeFixtureStorage) {
      (global as any).__typeFixtureStorage = new TypeInfoStorage();
    }

    return (global as any).__typeFixtureStorage;
  }

  constructor() {
    this.storage = new Map<string, ITypeInfo>();
  }

  /**
   * Adds a new type info and returns unique ID.
   */
  public addTypeInfo(typeInfo: ITypeInfo): string {
    const id = uuid();
    this.storage.set(id, typeInfo);
    return id;
  }

  /**
   * Retrieves stored type info with given ID.
   * @param id
   */
  public getTypeInfo(id: string): ITypeInfo | undefined {
    return this.storage.get(id);
  }
}
