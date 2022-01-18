DROP TABLE IF EXISTS lobbies; 

CREATE TABLE lobbies (
    id serial PRIMARY KEY,
    category varchar(1000) NOT NULL
);