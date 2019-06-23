import {TsTestUtils} from '../../test-utils/ts-test-utils';
import {TypeTraitBuilderFields} from './type-trait-builder-fields';
import {ITypeInfo} from './itype-info';
import {RequestKind} from '../ispecimen-request';

describe('TypeTraitBuilderFields', () => {
  it('Should create primitive fields', () => {

    const type = TsTestUtils.getInterface(
      'ISimple',
      `
interface ISimple {
  a: number;
  b: string;
}
`    );

    const builder = new TypeTraitBuilderFields();

    const typeInfo: Partial<ITypeInfo> = {};
    builder.build(type, typeInfo);

    expect(typeInfo.fields!.length).toEqual(2);
    expect(typeInfo.fields).toContainEqual({
      name: 'a',
      request: {kind: RequestKind.number}
    });
    expect(typeInfo.fields).toContainEqual({
      name: 'b',
      request: {kind: RequestKind.string}
    });
  });
});
