import fs from 'fs';

import {importInDb} from '../source/command.js';

const INPUT_PATH = './tests/fixtures/input/';
const OUTPUT_PATH = './tests/fixtures/output/';
const DB_FILENAME = './db-test.sqlite3';

test('Build site', () => {
  importInDb(INPUT_PATH, DB_FILENAME);

//  expect(title).toBe('');
});
