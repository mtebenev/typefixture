import {Type} from 'ts-morph';
import {TypeRecipeBuilderClass} from './type-recipe-builder-class';
import {NoTypeInfo} from './no-type-info';
import {TypeRecipeBuilderInterface} from './type-recipe-builder-interface';
import {TypeRecipeContext} from './type-recipe-context';
import {ITypeRecipeContext} from './itype-recipe-context';
import {TypeRecipeBuilderComposite} from './type-recipe-builder-composite';
import {ITypeRecipeRequest} from './itype-recipe-request';

export class TypeRecipeBuilder {

  /**
   * Type recipe builder root.
   */
  public build(type: Type): ITypeRecipeRequest {

    const context = this.createContext();
    const result = context.resolveType(type);

    if(result instanceof NoTypeInfo) {
      throw new Error('Cannot build type recipe.');
    }

    return result;
  }

  /**
   * Creates context with standard configuration
   */
  private createContext(): ITypeRecipeContext {

    // Compose builders
    const builders = [
      new TypeRecipeBuilderClass(),
      new TypeRecipeBuilderInterface()
    ];

    // Create context
    const rootBuilder = new TypeRecipeBuilderComposite(builders);
    const context = new TypeRecipeContext(rootBuilder);

    return context;
  }
}
