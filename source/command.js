import fs from 'fs';
import path from 'path';

import { load } from 'js-toml';

import {openDb, closeDb, createSchema, appendRelease} from './data.js';

export function importInDb(sourcePath, dbFilename) {
    openDb(dbFilename);
    createSchema();
  
    const inputFiles = fs.readdirSync(sourcePath);
  
    for (const releaseFilename of inputFiles) {
      const fileContent = fs.readFileSync(path.join(sourcePath, releaseFilename), 'utf8');
      const release = load(fileContent);
      appendRelease(release);
    }

    closeDb();
  }