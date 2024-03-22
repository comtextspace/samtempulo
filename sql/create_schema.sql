drop table if exists release;

create table release (
    id integer primary key autoincrement not null,
    date text not null
    );

drop table if exists note;

create table note (
    id integer primary key autoincrement not null,
    title text not null,
    type text not null,
    date test not null,
    description test
    );