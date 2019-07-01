import * as ts from 'typescript';
import {AngularCompilerPlugin} from '@ngtools/webpack';
import {TransformerFactoryAngular} from '@typefixture/angular';

function findAngularCompilerPlugin(webpackCfg): AngularCompilerPlugin | null {
  return webpackCfg.plugins.find(plugin => plugin instanceof AngularCompilerPlugin);
}

// The AngularCompilerPlugin has nog public API to add transformations, user private API _transformers instead.
function addTransformerToAngularCompilerPlugin(acp, transformer): void {
  acp._transformers = [transformer, ...acp._transformers];
}

export default {
  pre() {
    // This hook is not used in our example
  },

  // This hook is used to manipulate the webpack configuration
  config(cfg) {

    // Find the AngularCompilerPlugin in the webpack configuration
    const angularCompilerPlugin = findAngularCompilerPlugin(cfg);

    if(!angularCompilerPlugin) {
      console.error('Could not inject the typescript transformer: Webpack AngularCompilerPlugin not found');
      return;
    }

    const transformer = TransformerFactoryAngular.create(ts);
    addTransformerToAngularCompilerPlugin(angularCompilerPlugin, transformer);

    return cfg;
  },

  post() {
    // This hook is not used in our example
  }
};
