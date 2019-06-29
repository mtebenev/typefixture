import {Fixture} from '@typefixture/core';

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

test('Should create a class instance', () => {
  const fixture = new Fixture();
  const generated = fixture.create<TestClass>();

  expect(generated).toBeInstanceOf(TestClass);
  expect(generated.initializedField).toEqual(42);
});

test('Should create an object with interface', () => {
  const fixture = new Fixture();
  const generated = fixture.create<ITestInterface>();
  expect(generated.a).toEqual(expect.any(Number));
  expect(generated.b).toEqual(expect.any(String));
  expect(generated.c).toEqual(expect.any(Number));
});

test('Should create an object with nested class instances', () => {
  const fixture = new Fixture();
  const generated = fixture.create<IComplexInterface>();
  expect(generated.a).toBeInstanceOf(TestClass);
  expect(generated.b).toBeInstanceOf(TestClass);
});

test('Should create an object with non-default constructor', () => {
  const fixture = new Fixture();
  const generated = fixture.create<ClassWithConstructor>();
  expect(generated.a).toEqual(expect.any(Number));
  expect(generated.b).toEqual(expect.any(Number));
  expect(generated.c).toEqual(expect.any(Number));
  expect(generated.product).toEqual(generated.a * generated.b * generated.c);
});
