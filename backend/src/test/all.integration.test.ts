import path from 'path'
import fg from 'fast-glob'

const testsPaths = fg.sync([path.resolve(__dirname, '../**/*.integration.test.ts'), `!${__filename}`], {
  absolute: true,
})
for (const testPath of testsPaths) {
  require(testPath)
}
