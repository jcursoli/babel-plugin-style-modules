import { transform, transformFileSync } from 'babel-core';
import plugin from '../src/index.js';
import { readdirSync, readFileSync } from 'fs';
import expect from 'expect';

const fixturesDir =  `${__dirname}/fixtures`;

readdirSync(fixturesDir).forEach((file) => {
  const actualPath = `${fixturesDir}/${file}/actual.js`;
  const expected = `${fixturesDir}/${file}/expected.js`;

  const expectedFileContents = readFileSync(expected) + '';

  const actualFileContents = transformFileSync(actualPath, {
              presets: ["react"],
              plugins: [[plugin, { css: 'true' }]]
            }).code;
  expect(actualFileContents.trim()).toEqual(expectedFileContents.trim());

})
