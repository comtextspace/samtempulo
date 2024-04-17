import fs from 'fs';
import path from 'path';

import { load } from 'js-toml';

import {openDb, 
  closeDb, 
  createSchema, 
  appendObject,
  loadData,
  getObjects
} from './data.js';

import {makeIndex, makeMainPage, makePages} from './export.js';

const INDEX_FILENAME = 'index.md';
const INDEX_PEOPLE_FILENAME = 'homo.md';
const INDEX_GROUP_FILENAME = 'grupo.md';

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

  const notes = getObjects(['book', 'article']);
  const indexContent = makeMainPage(notes);
  fs.writeFileSync(path.join(destPath, INDEX_FILENAME), indexContent, 'utf8');

  const objectsForPages = getObjects(['author', 'group', 'book', 'article']);
  const pages = makePages(objectsForPages);

  for (const page of pages) {
    const fullFilename = path.join(destPath, page.filename);
    fs.writeFileSync(fullFilename, page.content, 'utf8');  
  }

  const indexAuthor = makeIndex('Люди', getObjects(['author']));
  const indexAuthorFilename = path.join(destPath, INDEX_PEOPLE_FILENAME);
  fs.writeFileSync(indexAuthorFilename, indexAuthor, 'utf8');

  const indexGroup = makeIndex('Группы', getObjects(['group']));
  const indexGroupFilename = path.join(destPath, INDEX_GROUP_FILENAME);
  fs.writeFileSync(indexGroupFilename, indexGroup, 'utf8');

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