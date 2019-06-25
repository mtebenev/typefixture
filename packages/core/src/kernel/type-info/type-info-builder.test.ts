import {Project} from 'ts-morph';
import {TypeInfoBuilder} from './type-info-builder';
import {RequestKind} from '../ispecimen-request';
import {TsTestUtils} from '../../test-utils/ts-test-utils';

describe('dummyx', () => {
  it('sh', () => {

  });

});

/*
describe('TypeInfoBuilder', () => {
  it('Should create primitive fields', () => {

    const type = TsTestUtils.getInterface(
      'ISimple',
      `
interface ISimple {
  a: number;
  b: string;
}
`    );

    const builder = new TypeInfoBuilder();
    const typeInfo = builder.build(type);

    expect(typeInfo.fields.length).toEqual(2);
    expect(typeInfo.fields).toContainEqual({
      name: 'a',
      request: {kind: RequestKind.number}
    });
    expect(typeInfo.fields).toContainEqual({
      name: 'b',
      request: {kind: RequestKind.string}
    });
  });

  it('Should fill constructor info', () => {
    const type = TsTestUtils.getClass(
      'TestClass',
      `
class TestClass {
  constructor(a: number) { let b = a; }
  public test() {}
}
`    );
const t2 = type.compilerType;
// console.error(t2);
const builder = new TypeInfoBuilder();
    // const typeInfo = builder.build(type);

    const constructors = t2.getConstructSignatures();
    console.error(constructors.length);

    const members = t2.getCallSignatures();
    console.error(members.length);

    const fields = t2.getProperties();
    console.error(fields.length);

    const sym = type.getSymbolOrThrow();
    console.error(sym.getFullyQualifiedName());

    const symDecls = sym.getDeclarations();
    symDecls.forEach(sd => {
      console.error(sd);
    });

    console.error(sym.getMembers().length);
    sym.getMembers().forEach(m => {
      console.error(`${m.getName()}, ${m.getDeclarations()}`);
    });
  });
});
*/
