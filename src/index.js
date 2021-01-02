import { createFilter } from '@rollup/pluginutils';
import { parseSync, transformFromAstSync } from '@babel/core';
import babelPlugin from 'astroturf/plugin'

export default function astroturf({include, exclude, ...rest} = {}) {
  const filter = createFilter(include || /\.(jsx?|tsx?)/i, exclude)
  const cssLookup = {}
  const pathMap = {}
  return {
    name: 'astroturf',

    load(id) {
      return cssLookup[id];
    },

    resolveId(importee) {
      if (importee in cssLookup) return cssLookup[importee];
      if (importee in pathMap) return pathMap[importee];
    },

    transform(code, id) {
      if (!filter(id)) return
      const {code: transformedCode, generatedFiles, sourceMap} = transform(code, {
        filename: id,
        ...rest
      })

      Object.assign(cssLookup, Object.fromEntries(generatedFiles.map(({fullPath, code}) => ([fullPath, code]))))
      Object.assign(pathMap, Object.fromEntries(generatedFiles.map(({importPath, fullPath}) => ([importPath, fullPath]))))
      return {
        code: transformedCode,
        map: sourceMap
      };

    }
  }
}

function transform(code, {filename, plugins, ...rest} = {}) {
  plugins = plugins || []
  const ast = parseSync(code, {
    filename,
    plugins: [...plugins],
    caller: {
      name: 'astroturf'
    }
  });
  const {metadata, code: transformedCode, map} = transformFromAstSync(ast, code, {
    filename,
    babelrc: false,
    configFile: false,
    sourceMaps: true,
    sourceFileName: filename,
    plugins: [...plugins, [babelPlugin, {...rest, writeFiles: false}]],
    inputSourceMap: undefined
  });

  const generatedFiles = metadata.astroturf.styles
    .map(({absoluteFilePath, requirePath, value}) => ({importPath: requirePath, fullPath: absoluteFilePath, code: value}))

  return {
    code: transformedCode || '',
    generatedFiles,
    sourceMap: map
  }

}
