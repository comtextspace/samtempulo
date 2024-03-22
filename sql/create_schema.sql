drop table if exists note;
drop table if exists release;

create table release (
    id integer primary key autoincrement not null,
    date text not null
    );

create table note (
    id integer primary key autoincrement not null,
    release_id integer not null,
    title text not null,
    type text not null,
    date test not null,
    description test,
    foreign key(release_id) references release(id)
    );