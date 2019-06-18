import {SpecimenBuilderTypeInfo} from './specimen-builder-type-info';
import {TypeInfoStorage} from './kernel/instrumentation/type-info-storage';
import {ITypeInfo} from './kernel/instrumentation/itype-info';
import {RequestKind} from './kernel/ispecimen-request';
import {SpecimenContext} from './specimen-context';
import {ISpecimenContext} from './kernel';
import {SpecimenBuilderPrimitive} from './specimen-builder-primitive';
import {SpecimenBuilderComposite} from './specimen-builder-composite';

describe('SpecimenBuilderTypeInfo', () => {
  it('Should create interface with primitive fields', () => {

    interface IExample {
      a: number;
      b: number;
    }

    const storage = new TypeInfoStorage();
    const typeInfo: ITypeInfo = {
      fields: [
        {
          name: 'a',
          request: {
            kind: RequestKind.number
          }
        },
        {
          name: 'b',
          request: {
            kind: RequestKind.number
          }
        }
      ]
    };
    const typeId = storage.addTypeInfo(typeInfo);
    const context = createMockContext();

    const sut = new SpecimenBuilderTypeInfo(storage);
    const specimen: IExample = sut.create(
      {kind: RequestKind.typeInfo, value: typeId},
      context
    );

    expect(specimen.a).toEqual(expect.any(Number));
    expect(specimen.b).toEqual(expect.any(Number));
  });
});

function createMockContext(): ISpecimenContext {
  const standardBuilders = [
    new SpecimenBuilderPrimitive()
  ];

  const allBuilders = [...standardBuilders];
  const rootBuilder = new SpecimenBuilderComposite(allBuilders);
  const context = new SpecimenContext(rootBuilder);

  return context;
}
