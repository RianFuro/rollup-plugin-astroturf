const plugin = require('../src/index').default
const rollup = require('rollup')
const postcss = require('rollup-plugin-postcss')
const assert = require('assert')
const fs = require('fs')
const path = require("path")

process.chdir(__dirname);

describe('rollup-plugin-astroturf', () => {
  it('correctly applies the source code transformation by replacing the tagged template with the parsed classes', () => {
    return act().then(generated => {
      assert.strictEqual(
        generated.output[0].code,
        fs.readFileSync('fixtures/expected.main.js').toString('utf-8'))
    })
  })

  it('provides the extracted css back to rollup', () => {
    const sniffedFiles = {}
    const pluginStub = {
      transform(code, id) {
        sniffedFiles[id] = code
      }
    }

    return act({plugins: [pluginStub]}).then(() => {
      let id = path.join(__dirname, 'fixtures', 'main-styles.css')
      assert.ok(id in sniffedFiles)
      assert.strictEqual(
        sniffedFiles[id],
        fs.readFileSync(path.join('fixtures', 'expected.main-styles.css')).toString('utf-8'))
    })
  })
})

function act({plugins = []} = {}) {
  return rollup.rollup({
    input: 'fixtures/main.js',
    plugins: [plugin(), ...plugins, postcss({extract: 'bundle.css', modules: true,})],
  }).then(bundle =>
    bundle.generate({
      format: 'iife',
      name: 'test'
    })
  )
}
