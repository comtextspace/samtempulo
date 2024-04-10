drop table if exists note;
drop table if exists release;

drop table if exists connection;
drop table if exists object;
drop table if exists object_type;
drop table if exists connection_type;

create table object_type (
  id text primary key not null
);

insert into object_type(id) values
('article'),
('author'),
('book'),
('group');

create table object (
    id text primary key not null,
    type text not null,
    name text not null,
    date text,
    links text, -- JSON
    description text,
    fields text, -- JSON
    foreign key(type) references object_type(id)
    );

create table connection_type (
  id text primary key not null,
  description text  

);

insert into connection_type(id, description) values
('author_group', 'object1 является работой группы object2'),
('author', 'работа object1 является работой object2'),
('mention', 'в работе object1 упоминается object2'),
('member', 'object1 член группы object2');

create table connection (
    object1 text not null, -- UUID
    connection_type text not null,
    object2 text not null, -- UUID
    foreign key(connection_type) references connection_type(id)
  --  foreign key(object1) references object(id)
  --  foreign key(object2) references object(id)
    );
