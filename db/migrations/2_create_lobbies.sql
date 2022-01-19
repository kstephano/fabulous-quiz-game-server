DROP TABLE IF EXISTS lobbies; 

CREATE TABLE lobbies (
    id serial PRIMARY KEY,
    category int NOT NULL,
    rounds int NOT NULL,
    difficulty varchar(20) NOT NULL,
    roundLimit int NOT NULL    
);