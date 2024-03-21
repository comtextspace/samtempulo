import fs from 'fs';

import Sqlite3 from 'better-sqlite3';

/* Project modules */

/* Constants */

const DB_FILENAME = './db.sqlite3';

const SQL_CREATE_SCHEMA_FILENAME = './sql/create_schema.sql';

/* Export */

let db = null;

export function openDb() {
  db = new Sqlite3(DB_FILENAME);
}

export function closeDb() {
  db.close();
}

export function createSchema() {
  const sql = fs.readFileSync(SQL_CREATE_SCHEMA_FILENAME, 'utf8');
  db.exec(sql);
}