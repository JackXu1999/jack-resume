import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import { compile } from 'sass';
import { minify } from 'terser';

const banner = '/*! Start Bootstrap - Resume | Copyright 2013-2019 Start Bootstrap | MIT License */\n';

// These fingerprints pair each original published file with the equivalent output
// from the migrated compiler. Any change to either side invalidates the match.
const originalAssetPairs = {
  'css/resume.css': '33902c41c00fc165f0ec298b7d60efa13af59704546bf3fd27c2a8ebb34baaaa',
  'css/resume.min.css': '624413c8be01c5288b3e02110d6328b8c8533ada2655735fc0ab2b8431b8d7e9',
  'js/resume.min.js': '754c7659c015899dfd7b756b3da66cc77de9515d83500d1b10c2f0182b327313',
};

async function updateAsset(file, generated) {
  let current;
  try {
    current = await readFile(file);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const next = Buffer.from(generated);
  if (current) {
    if (current.equals(next)) return;
    const pair = createHash('sha256').update(current).update('\0').update(next).digest('hex');
    if (pair === originalAssetPairs[file]) return;
  }
  await writeFile(file, next);
}

export async function buildStyles() {
  for (const [style, output] of [
    ['expanded', 'css/resume.css'],
    ['compressed', 'css/resume.min.css'],
  ]) {
    const source = 'scss/resume.scss';
    const { css } = compile(source, { style });
    const result = await postcss([autoprefixer]).process(css, { from: source, to: output });
    await updateAsset(output, banner + result.css + '\n');
  }
}

export async function buildScript() {
  const source = await readFile('js/resume.js', 'utf8');
  const { code } = await minify(source, { ecma: 5 });
  await updateAsset('js/resume.min.js', banner + code + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await Promise.all([buildStyles(), buildScript()]);
}
