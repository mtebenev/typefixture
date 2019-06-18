import {Fixture} from '@typefixture/core';

interface ITestInterface {
  ax: number;
  bx: number;
  cy: number;
}

/**
 * Dummy test
 */
describe("Probe test", () => {
  it("works", () => {
    console.warn(`INSIDE TEST: ${JSON.stringify((global as any).TESTIX)}`);
    console.warn(`TEST RUN PROCESS ID: ${process.pid}`);
    console.warn(`STARTING TEST`);
    const fixture = new Fixture();
    const generated = fixture.create<ITestInterface>();

    console.warn(`RESULT: ${JSON.stringify(generated)}`);
  })
})
