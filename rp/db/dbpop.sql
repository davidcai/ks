DROP DATABASE IF EXISTS rp;
CREATE DATABASE rp;

\connect rp

CREATE TABLE themes (
  id serial primary key, 
  name varchar(50) not null, 
  color varchar(20) not null
);

CREATE TABLE initiatives (
  id serial primary key, 
  theme_id integer references themes(id), 
  name varchar(100)
);
