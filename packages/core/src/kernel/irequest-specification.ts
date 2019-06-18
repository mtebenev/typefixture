/**
 * A Specification that evaluates requests.
 * This is a codification of the Specification patter for requests. This interface can (and should)
 * be used in any place where you need to filter requests for specimens.
 */
export interface IRequestSpecificationn {

  /**
   * Evaluates a request for a specimen.
   * @param request The specimen request.
   */
  isSatisfiedBy(request: any): boolean;
}
