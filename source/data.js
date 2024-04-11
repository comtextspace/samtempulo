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

class Object {
  constructor(id, type, name, date, description, links) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.date = date;
    this.description = description;
    this.links = links;

    this.connection_to = [];
    this.connection_from = [];
  }

  getConnections(direction, type) {
    if (direction == 'to') {
      return [ ...this.connection_to
        .filter(con => con.type == type)
        .map(con => con.to)];
    }

    return [...this.connection_from
      .filter(con => con.type == type)
      .map(con => con.from)];
  }
}

const objectList = [];
const objectMap = new Map();

export function loadData() {
  const stmtObjects = db.prepare(SQL_SELECT_OBJECTS);

  for (const dbObj of stmtObjects.all()) {
    const obj = new Object(
      dbObj.id, 
      dbObj.type, 
      dbObj.name,
      dbObj.date,
      dbObj.description,
      dbObj.links,
    );

    objectList.push(obj);
    objectMap.set(obj.id, obj);
  }

  const stmtConnections = db.prepare(SQL_SELECT_CONNECTIONS);
  /*
('author_group', 'object1 является работой группы object2'),
('author', 'работа object1 является работой object2'),
('mention', 'в работе object1 упоминается object2'),
('member', 'object1 член группы object2');
*/
  for (const connection of stmtConnections.all()) {
    const obj1 = objectMap.get(connection.object1);
    const obj2 = objectMap.get(connection.object2);

    if (!obj1) {
      throw 'Не найден объект ' + connection.object1;
    }

    if (!obj2) {
      throw 'Не найден объект ' + connection.object2;
    }

    obj1.connection_to.push({
      type: connection.connection_type,
      to: obj2 
    });

    obj2.connection_from.push({
      type: connection.connection_type,
      from: obj1 
    });
  }
}

export function getObjects() {
  return objectList;
}

export function getAuthors() {
  return objectList.filter(
    obj => ['author'].includes(obj.type)
  );
}

export function getGroups() {
  return objectList.filter(
    obj => ['group'].includes(obj.type)
  );
}

export function getNotes() {
  return objectList.filter(
    obj => ['book', 'article'].includes(obj.type)
  );
}

export function appendObject(object) {
  const objectStmt = db.prepare(SQL_INSERT_OBJECT);

  objectStmt.run({
    id: object.id,
    type: object.type,
    name: object.name,
    date: object.date ? moment(object.date).format('YYYY-MM-DD') : null,
    links: object.link ? JSON.stringify(object.link) : null,
    description: object.description ? object.description : null,
    fields: object.fields ? object.fields : null
  });

  const connectionStmt = db.prepare(SQL_INSERT_CONNECTION);

  object?.connections?.forEach(connection => {
    connectionStmt.run({
      object1: object.id,
      connection_type: connection.type,
      object2: connection.to
    });
  });
}

const SQL_INSERT_OBJECT = `
insert into object (
  id,            -- 1
  type,          -- 2
  name,          -- 3
  date,          -- 4
  links,         -- 5
  description,   -- 6
  fields         -- 7
  ) 
  values (
    :id,            -- 1
    :type,          -- 2
    :name,          -- 3
    :date,          -- 4
    :links,         -- 5
    :description,   -- 6
    :fields         -- 7
  );
`;

const SQL_INSERT_CONNECTION = `
insert into connection (
  object1,           -- 1
  connection_type,   -- 2
  object2            -- 3
  ) 
  values (
    :object1,           -- 1
    :connection_type,   -- 2
    :object2            -- 3
  );
`;

const SQL_SELECT_OBJECTS = `
select
  o.id,
  o.type,
  o.name,
  o.date,
  o.links,
  o.description
from
  object o
-- where
--  o.type in ('book', 'article')
order by
  o.date desc 
`;

const SQL_SELECT_CONNECTIONS = `
SELECT
  object1, 
  connection_type, 
  object2
FROM 
  "connection";
`;
