import fs from 'fs';
import path from 'path';

import { load } from 'js-toml';

import {openDb, 
        closeDb, 
        createSchema, 
        appendRelease,
        getReleases} from './data.js';

import {makeIndex} from './export.js';

const INDEX_FILENAME = 'index.md';

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

  export function exportFromDb(destPath, dbFilename) {
    openDb(dbFilename);

    const releases = getReleases();
    const indexContent = makeIndex(releases);

    fs.writeFileSync(path.join(destPath, INDEX_FILENAME), indexContent, 'utf8')

    closeDb();
  }