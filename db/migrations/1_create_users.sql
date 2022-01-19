DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id serial PRIMARY KEY,
    username varchar(1000) NOT NULL,
    score decimal (5,2) NOT NULL,
    lobby_id int NOT NULL
);
