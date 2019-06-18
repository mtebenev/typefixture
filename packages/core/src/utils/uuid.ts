/**
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * https://github.com/kelektiv/node-uuid/issues/245
 */
export function uuid(): string {
  // tslint:disable
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  // tslint:enable
}
