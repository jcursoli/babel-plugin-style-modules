import { transform, transformFileSync } from 'babel-core';
import plugin from '../src/index.js';
import { readdirSync, readFileSync } from 'fs';
import minify from './helpers/minify.js';
import expect from 'expect';

const fixturesDir =  `${__dirname}/fixtures`;
let passedTests = 0;
const directories = readdirSync(fixturesDir);
directories.forEach((file) => {
  const actualPath = `${fixturesDir}/${file}/actual.js`;
  const expected = `${fixturesDir}/${file}/expected.js`;

  const expectedFileContents = minify(readFileSync(expected) + '');

  const actualFileContents = minify(transformFileSync(actualPath, {
              presets: ['react'],
              plugins: [[plugin, { css: 'true' }]]
            }).code);
  try {
    expect(actualFileContents).toEqual(expectedFileContents);
    console.log(`${file} test passed!`);
    passedTests++;
  } catch (e) {
    console.warn(`test failed at ${file}`);
  }
})
console.log(`\n${passedTests} tests passed out of ${directories.length}`)
