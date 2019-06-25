import {SpecimenBuilderTypeInfo} from './specimen-builder-type-info';
import {ITypeInfo} from './kernel/type-info/itype-info';
import {RequestKind} from './kernel/ispecimen-request';
import {SpecimenContext} from './specimen-context';
import {ISpecimenContext} from './kernel';
import {SpecimenBuilderPrimitive} from './specimen-builder-primitive';
import {SpecimenBuilderComposite} from './specimen-builder-composite';
import {ITypeInfoStorage} from './kernel/instrumentation/itype-info-storage';

describe('SpecimenBuilderTypeInfo', () => {
  it('Should create interface with primitive fields', () => {

    interface IExample {
      a: number;
      b: number;
    }

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
    const context = createMockContext();

    const sut = new SpecimenBuilderTypeInfo({} as ITypeInfoStorage);
    const specimen: IExample = sut.create(
      {kind: RequestKind.typeInfo, value: typeInfo},
      context
    );

    expect(specimen.a).toEqual(expect.any(Number));
    expect(specimen.b).toEqual(expect.any(Number));
  });

  it('Should create class instance', () => {

    class SomeClass {}

    const typeInfo: ITypeInfo = {
      fields: [],
      ctor: SomeClass
    };
    const context = createMockContext();

    const sut = new SpecimenBuilderTypeInfo({} as ITypeInfoStorage);
    const specimen: SomeClass = sut.create(
      {kind: RequestKind.typeInfo, value: typeInfo},
      context
    );

    expect(specimen).toBeInstanceOf(SomeClass);
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
