DROP TABLE IF EXISTS petshop;

CREATE TABLE petshop (
    id serial PRIMARY KEY, 
    name VARCHAR(30),
    kind VARCHAR(30),
    age integer
);