import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Compare the distributable browser code and fonts, including variants and maps.
const directories = [
  ['bootstrap/dist/css', 'bootstrap/css'],
  ['bootstrap/dist/js', 'bootstrap/js'],
  ['jquery/dist', 'jquery'],
  ['jquery.easing', 'jquery-easing'],
  ...['css', 'js', 'webfonts'].map(dir => [
    `@fortawesome/fontawesome-free/${dir}`, `fontawesome-free-6.5.1-web/${dir}`,
  ]),
];

for (const [source, destination] of directories) {
  const installed = join('node_modules', source);
  const published = join('vendor', destination);
  const isAsset = name => /\.(?:css|js|map|woff2?|ttf)$/.test(name);
  const expected = (await readdir(installed)).filter(isAsset).sort();
  const actual = (await readdir(published)).filter(isAsset).sort();
  assert.deepEqual(actual, expected, `Browser asset filenames differ between ${installed} and ${published}`);
  for (const name of expected) {
    const target = join(published, name);
    const original = join(installed, name);
    const [asset, dependency] = await Promise.all([readFile(target), readFile(original)]);
    if (!asset.equals(dependency)) throw new Error(`${target} differs from ${original}. Update the vendored copy.`);
  }
}
