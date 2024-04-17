import fs from 'fs';
import path from 'path';

import {importInDb, exportFromDb} from '../source/command.js';

const INPUT_PATH = './tests/fixtures/input/';
const CORRECT_OUTPUT_PATH = './tests/fixtures/output/';
const OUTPUT_PATH = './tests/output/';
const DB_FILENAME = './db-test.sqlite3';

test('Build site', () => {
  for (const filename of fs.readdirSync(OUTPUT_PATH)) {
    if (filename == 'dummy.txt') {
      continue;
    }
    fs.unlinkSync(path.join(OUTPUT_PATH, filename));
  }

  importInDb(INPUT_PATH, DB_FILENAME);
  exportFromDb(OUTPUT_PATH, DB_FILENAME);

  const filesActual = fs.readdirSync(OUTPUT_PATH);
  const filesCorrect = fs.readdirSync(CORRECT_OUTPUT_PATH);

  expect(filesActual).toEqual(filesCorrect);

  for (const filename of filesActual) {
    const actualFullFilename = path.join(OUTPUT_PATH, filename);
    const correctFullFilename = path.join(CORRECT_OUTPUT_PATH, filename);

    const actualFileContent = fs.readFileSync(actualFullFilename, 'utf8');
    const correctFileContent = fs.readFileSync(correctFullFilename, 'utf8');
  
    expect(actualFileContent, `File ${filename}`).toBe(correctFileContent);
  }

});
