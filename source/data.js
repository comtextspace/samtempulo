import fs from 'fs';

import Sqlite3 from 'better-sqlite3';

/* Project modules */

/* Constants */

const SQL_CREATE_SCHEMA_FILENAME = './sql/create_schema.sql';

/* Export */

let db = null;

export function openDb(filename) {
  db = new Sqlite3(filename);
}

export function closeDb() {
  db.close();
}

export function createSchema() {
  const sql = fs.readFileSync(SQL_CREATE_SCHEMA_FILENAME, 'utf8');
  db.exec(sql);
}

export function appendRelease(release) {
  const releaseStmt = db.prepare(SQL_INSERT_RELEASE);

  const infoRelease = releaseStmt.run({
    date: release.date.toISOString()
  });

  const idRelease = infoRelease.lastInsertRowid;

  const noteStmt = db.prepare(SQL_INSERT_NOTE);

  for (const note of release.note) {
    noteStmt.run({
      title: note.title,
      type: note.type,
      date: note.date.toISOString(),
      description: note.description
    });
  }
}

const SQL_INSERT_RELEASE = `
insert into release (date) values (:date);
`;

const SQL_INSERT_NOTE = `
insert into note (title, type, date, description) 
values (:title, :type, :date, :description);
`;

