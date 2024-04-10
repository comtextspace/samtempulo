import fs from 'fs';
import path from 'path';

import { load } from 'js-toml';

import {openDb, 
  closeDb, 
  createSchema, 
  appendObject,
  loadData,
  getNotes
} from './data.js';

import {makeIndex} from './export.js';

const INDEX_FILENAME = 'index.md';

export function importInDb(sourcePath, dbFilename) {
  openDb(dbFilename);
  createSchema();
  
  const inputFiles = fs.readdirSync(sourcePath);
  
  for (const releaseFilename of inputFiles) {
    const fullFilename = path.join(sourcePath, releaseFilename);
    try {
      loadFile(fullFilename);
    } catch (err) {
      console.log(`Ошибка при загрузке файла ${fullFilename}`);
      console.log(err);
    }
  }

  closeDb();
}

export function exportFromDb(destPath, dbFilename) {
  openDb(dbFilename);
  loadData();

  const notes = getNotes();
  const indexContent = makeIndex(notes);

  fs.writeFileSync(path.join(destPath, INDEX_FILENAME), indexContent, 'utf8');

  closeDb();
}

function loadFile(filename) {
  const fileContent = fs.readFileSync(filename, 'utf8');
  const objects = load(fileContent);
  
  const groups = objects.group;
  const authors = objects.author;
  const books = objects.book;
  const articles = objects.article;

  groups?.forEach(group => {
    group.type = "group";
    appendObject(group);
  });

  authors?.forEach(author => {
    author.type = "author";
    appendObject(author);
  });

  books?.forEach(book => {
    book.type = "book";
    appendObject(book);
  });

  articles?.forEach(article => {
    article.type = "article";
    appendObject(article);
  });

}