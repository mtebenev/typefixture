Overview
--------

This library is inspired by [AutoFixture](https://github.com/AutoFixture/AutoFixture) but written with TypeScript for TypeScript developers.

TL;DR
-----

```TypeScript
import {Fixture} from '@typefixture/core';
interface ITestInterface {
  a: number;
  b: string;
}
describe('Jest simple tests', () => {
  it('Should create an object with interface', () => {
    const fixture = new Fixture();
    const generated = fixture.create<ITestInterface>();
    expect(generated.a).toEqual(expect.any(Number));
    expect(generated.b).toEqual(expect.any(String));
  });
});

```

Using with Jest (ts-jest)
---------------------
```bash
npm install @typefixture/core --save-dev
npm install @typefixture/jest --save-dev
npm install ts-morph --save-dev
```

In jest.config.js
```JavaScript
...
globals: {
  'ts-jest': {
    astTransformers: [
      '@typefixture/jest'
    ]
  }
}
...
```

Word of caution
---------------
* This library is in PoC state.
* ts-morph dependency to be removed.

Known issues
------------
* Use --no-cache jest CLI option (i.e. npx jest --no-cache)
