/**
 * Supported specimen requests.
 */
export enum RequestKind {

  /**
   * The number request. The value is ignored.
   */
  number,

  /**
   * The string request. The value is ignored.
   */
  string,

  /**
   * The request is inlined type info request.
   */
  typeInfo,

  /**
   * The request is type info and value is the type id.
   */
  typeInfoId
}

/**
 * Unlike .Net we do not have true reflection in run-time. This interface describes the request underneath.
 */
export interface ISpecimenRequest {

  /**
   * The request kind.
   */
  kind: RequestKind;

  /**
   * Depends on the request kind.
   */
  value?: any;
}
