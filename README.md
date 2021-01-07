[![Last version](https://img.shields.io/npm/v/rollup-plugin-astroturf.svg)](https://www.npmjs.com/package/rollup-plugin-astroturf)
[![License](https://img.shields.io/npm/l/rollup-plugin-astroturf.svg)](https://github.com/RianFuro/rollup-plugin-astroturf/blob/master/LICENSE)

# rollup-plugin-astroturf

[Rollup](https://rollupjs.org/guide/en/) plugin for [Astroturf](https://github.com/4Catalyzer/astroturf).

This plugin basically wraps Astroturf's Babel plugin and provides the extracted css to Rollup.

### Why use this instead of simply using Rollup's Babel plugin?

The babel plugin needs to write the extracted css to disk so rollup can pick it up again. The main advantage of this
plugin is that is doesn't need to do that, as the extracted css is captured and exposed to other plugins internally.

## Installation

```bash
npm i -D rollup-plugin-astroturf
```

Note that `astroturf`, `rollup` and `@babel/core` are all peer dependencies of this plugin, so you need to install them
yourself. This plugin has been written against the 1.0.0-beta of astroturf, your mileage with the stable release may
vary, but it *SHOULD* work.

## Usage

*Note*: Astroturf expects uncompiled JavaScript code. If you are using Babel or Typescript to 
transform tagged template literals, ensure the plugin runs before Babel or Typescript loaders.

```js
import { rollup } from 'rollup';
import astroturf from 'rollup-plugin-astroturf';
import postcss from 'rollup-plugin-postcss';

rollup({
  entry: 'main.js',
  plugins: [
    astroturf({/* options */}),
    postcss({
      extract: 'bundle.css',
      modules: true
    })
  ]
}).then(/*...*/)
```

### with jsx

If you're using jsx in your code you need to tell the plugin to interpret jsx (Babel does not do that by default). Do
that by installing and including `@babel/plugin-syntax-jsx` like so:

```js
import { rollup } from 'rollup';
import astroturf from 'rollup-plugin-astroturf';
import postcss from 'rollup-plugin-postcss';

rollup({
  entry: 'main.js',
  plugins: [
    astroturf({plugins: ['@babel/plugin-syntax-jsx']}),
    postcss({
      extract: 'bundle.css',
      modules: true
    })
  ]
}).then(/*...*/)
```

### Options

All options are optional

- `include` / `exclude`
  Both which can be a [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern or an array of 
  picomatch patterns. If `options.include` is omitted or of zero length, the filter defaults to javascript/typescript
  files.
- `plugins`
  An array of Babel plugins which are passed on to all Babel invocations made by the plugin.
- All other options passed in this object are passed on to the underlying astroturf babel plugin. See the 
  [Babel plugin documentation](https://github.com/rollup/plugins/tree/master/packages/babel) and 
  [Astroturf's options](https://github.com/4Catalyzer/astroturf/tree/master#options) for details.
  
  Note though that `writeFiles` is fixed to `false`. Use rollup to control how files are written.
  
## Attribution

This plugin is heavily inspired by [Linaria's Rollup plugin](https://github.com/callstack/linaria/tree/master/packages/rollup), as it serves a similar purpose.
