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

CREATE TABLE teams (
  id serial primary key, 
  name varchar(30) not null, 
  product_owner varchar(30), 
  scrum_master varchar(30)
);

CREATE TABLE stories (
  id serial primary key, 
  team_id integer references teams(id), 
  initiative_id integer references initiatives(id), 
  name varchar(200) not null, 
  owner varchar(30), 
  release varchar(20), 
  notes text
);

INSERT INTO themes (name, color) VALUES ('theme blue', 'blue');
INSERT INTO themes (name, color) VALUES ('theme green', 'green');
INSERT INTO themes (name, color) VALUES ('theme yellow', 'yellow');
INSERT INTO themes (name, color) VALUES ('theme orange', 'orange');
INSERT INTO themes (name, color) VALUES ('theme red', 'red');

INSERT INTO initiatives (name, theme_id) VALUES ('initiative 1a', 1);
INSERT INTO initiatives (name, theme_id) VALUES ('initiative 1b', 1);
INSERT INTO initiatives (name, theme_id) VALUES ('initiative 2a', 2);
INSERT INTO initiatives (name, theme_id) VALUES ('initiative 2b', 2);
INSERT INTO initiatives (name, theme_id) VALUES ('initiative 3a', 3);
INSERT INTO initiatives (name, theme_id) VALUES ('initiative 4a', 4);
INSERT INTO initiatives (name, theme_id) VALUES ('initiative 4b', 4);
INSERT INTO initiatives (name, theme_id) VALUES ('initiative 5a', 5);
INSERT INTO initiatives (name, theme_id) VALUES ('initiative 5b', 5);

INSERT INTO teams (name, product_owner, scrum_master) VALUES ('team 1', 'John', 'Ellen');
INSERT INTO teams (name, product_owner, scrum_master) VALUES ('team 2', 'Jane', 'Ellen');
INSERT INTO teams (name, product_owner, scrum_master) VALUES ('team 3', 'Tim', 'Tom');
INSERT INTO teams (name, product_owner, scrum_master) VALUES ('team 4', 'Michael', 'Tom');
INSERT INTO teams (name, product_owner, scrum_master) VALUES ('team 5', 'Brian', 'William');
INSERT INTO teams (name, product_owner, scrum_master) VALUES ('team 6', 'George', 'William');

INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 1a1', 'David', '2013-12', 1, 1);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 1b1', 'Michelle', '2013-12', 1, 1);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 1c1', 'Peter', '2013-11', 1, 1);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 1d6', 'Allen', '2014-01', 1, 6);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 2a2', 'Patrick', '2013-12', 2, 2);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 2b3', 'Nancy', '2013-11', 2, 3);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 2c8', 'Nathon', '2013-12', 2, 8);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 3a3', 'Daniel', '2013-12', 3, 3);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 3b4', 'Luiz', '2014-01', 3, 4);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 3c5', 'Steve', '2014-02', 3, 5);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 4a6', 'Diana', '2014-01', 4, 6);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 4b7', 'Leih', '2014-03', 4, 7);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 4c8', 'Zivi', '2013-12', 4, 8);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 4d9', 'Diana', '2013-11', 4, 9);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 4e4', 'Mark', '2013-11', 4, 4);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 5a4', 'Joe', '2014-02', 5, 4);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 5b7', 'Adam', '2014-01', 5, 7);
INSERT INTO stories (name, owner, release, team_id, initiative_id) VALUES ('story 5c9', 'Eric', '2014-03', 5, 9);

