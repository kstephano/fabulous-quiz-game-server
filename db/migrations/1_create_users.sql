DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id serial PRIMARY KEY,
    username varchar(1000) NOT NULL,
    score INT,
    lobby_id int NOT NULL
);
