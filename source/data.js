import fs from 'fs';

import Sqlite3 from 'better-sqlite3';
import moment from 'moment';

/* Project modules */

/* Constants */

const SQL_CREATE_SCHEMA_FILENAME = './sql/create_schema.sql';

/* Export */

let db = null;

export function openDb(filename) {
  db = new Sqlite3(filename);
  db.pragma('journal_mode = WAL');
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
    date: moment(release.date).format('YYYY-MM-DD')
  });

  const releaseId = infoRelease.lastInsertRowid;

  const noteStmt = db.prepare(SQL_INSERT_NOTE);

  for (const note of release.note) {
    noteStmt.run({
      releaseId: releaseId,
      title: note.title,
      type: note.type,
      date: moment(note.date).format('YYYY-MM-DD'),
      description: note.description
    });
  }
}

export function getReleases() {
  const stmt = db.prepare(SQL_SELECT_RELEASE);
  return stmt.all();
}

const SQL_INSERT_RELEASE = `
insert into release (date) values (:date);
`;

const SQL_INSERT_NOTE = `
insert into note (release_id, title, type, date, description) 
values (:releaseId, :title, :type, :date, :description);
`;

const SQL_SELECT_RELEASE = `
select
  strftime('%Y-%m-%d', r.date) as releaseDate,
  n.title,
  n.type,
  n.date,
  n.description
from 
  "release" r join note n on
    r.id = n.release_id
order by
  r.date,
  n.date,
  n.title
`;
