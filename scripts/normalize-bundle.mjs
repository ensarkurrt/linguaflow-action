import { readFile, writeFile } from 'node:fs/promises'

for (const path of ['dist/index.cjs', 'dist/action-input.cjs']) {
  const source = await readFile(path, 'utf8')
  await writeFile(path, source.replace(/[\t ]+$/gm, ''))
}
