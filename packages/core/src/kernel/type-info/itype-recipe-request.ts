/**
 * Supported type recipe requests.
 */
export enum TypeRecipeRequestKind {

  /**
   * The number request. The value is ignored.
   */
  number,

  /**
   * The string request. The value is ignored.
   */
  string,

  /**
   * A recipe request. The value is a type recipe.
   */
  recipe
}

/**
 * Analysis state type info.
 */
export interface ITypeRecipeRequest {

  /**
   * The request kind.
   */
  kind: TypeRecipeRequestKind;

  /**
   * Depends on the request kind.
   */
  value?: any;
}

