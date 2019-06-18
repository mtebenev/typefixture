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
    create<ISimple>();
    `);

    const builder = new TypeInfoBuilder(project.getTypeChecker());
    const callExpression = sourceFile.getFirstDescendantByKindOrThrow(SyntaxKind.CallExpression);
    const typeInfo = builder.build(callExpression);

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
