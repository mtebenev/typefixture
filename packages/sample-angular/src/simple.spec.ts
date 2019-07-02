import {Fixture} from '@typefixture/core';

// tslint:disable:max-classes-per-file

interface ITestInterface {
  a: number;
  b: string;
  c: number;
}

class TestClass {
  public initializedField: number;
  constructor() {
    this.initializedField = 0;
    this.privateMeth();
  }

  private privateMeth(): void {
    this.initializedField = 42;
  }
}

interface IComplexInterface {
  a: TestClass;
  b: TestClass;
}

class ClassWithConstructor {

  public readonly product: number;

  constructor(
    public readonly a: number,
    public readonly b: number,
    public readonly c: number) {
    this.product = a * b * c;
  }
}

describe('Simple tests', () => {
  it('Should create a class instance', () => {
    const fixture = new Fixture();
    const generated = fixture.create<TestClass>();

    expect(generated).toEqual(jasmine.any(TestClass));
    expect(generated.initializedField).toEqual(42);
  });

  it('Should create an object with interface', () => {
    const fixture = new Fixture();
    const generated = fixture.create<ITestInterface>();
    expect(generated.a).toEqual(jasmine.any(Number));
    expect(generated.b).toEqual(jasmine.any(String));
    expect(generated.c).toEqual(jasmine.any(Number));
  });

  it('Should create an object with nested class instances', () => {
    const fixture = new Fixture();
    const generated = fixture.create<IComplexInterface>();
    expect(generated.a).toEqual(jasmine.any(TestClass));
    expect(generated.b).toEqual(jasmine.any(TestClass));
  });

  it('Should create a class instance with non-default constructor', () => {
    const fixture = new Fixture();
    const generated = fixture.create<ClassWithConstructor>();
    expect(generated.a).toEqual(jasmine.any(Number));
    expect(generated.b).toEqual(jasmine.any(Number));
    expect(generated.c).toEqual(jasmine.any(Number));
    expect(generated.product).toEqual(generated.a * generated.b * generated.c);
  });
});
