import {Project, SyntaxKind} from 'ts-morph';
import {TypeInfoBuilder} from './type-info-builder';
import {RequestKind} from '../ispecimen-request';

describe('TypeInfoBuilder', () => {
  it('Should create primite fields', () => {
    const project = new Project();
    const sourceFile = project.createSourceFile(
      'source.ts',
      `
    interface ISimple {
      a: number;
      b: string;
    }
    `);

    const type = sourceFile.getInterfaceOrThrow('ISimple').getType();
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
});
