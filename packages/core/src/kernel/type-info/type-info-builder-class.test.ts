import {TsTestUtils} from '../../test-utils/ts-test-utils';
import {TypeInfoBuilderClass} from './type-info-builder-class';
import {ITypeInfoContext} from './itype-info-context';
import {NoTypeInfo} from './no-type-info';

describe('TypeInfoBuilderClass', () => {
  it('Should return NoTypeInfo for interfaces', () => {
    const type = TsTestUtils.getInterface(
      'ISimple',
      `
interface ISimple {
}
`    );

    const builder = new TypeInfoBuilderClass();
    const typeInfo = builder.create(type, {} as ITypeInfoContext);
    expect(typeInfo).toBeInstanceOf(NoTypeInfo);
  });

  it('Should create type info for classes', () => {
    const type = TsTestUtils.getClass(
      'TestClass',
      `
class TestClass {
}
`    );

    const builder = new TypeInfoBuilderClass();
    const typeInfo = builder.create(type, {} as ITypeInfoContext);
    expect(typeInfo).toEqual({});
  });
});
