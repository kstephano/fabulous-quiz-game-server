DROP TABLE IF EXISTS lobbies; 

CREATE TABLE lobbies (
    id serial PRIMARY KEY,
    category varchar(1000) NOT NULL,
    rounds int (2) NOT NULL,
    difficulty varchar (20) NOT NULL    
);