import e from "express";
import express from "express";
import pg from "pg";

const app = express();
const expressPort = 8000;
const { Pool } = pg;

const petshopdb = new Pool({
  user: 'drkmannn',
  host: 'localhost',
  password: '2448',
  database: 'petshopdb',
  //this port is NOT the same as your localhost port, this is the default port for psql database
  port: 5432
});

app.use(express.json());
//app.use(logger);


//all pets route handler
app.get("/pets", (req, res, next) => {
  petshopdb.query("SELECT * FROM petshop")
    .then((result) => res.send(result.rows))
    .catch(next);
});


//specific pet route handler
app.get("/pets/:id", (req, res, next) => {
  petshopdb.query("SELECT * FROM petshop WHERE id = $1", [req.params.id])
    .then((result) => (result.rows.length === 0) ? res.status(404).set("Content-Type", "text/plain").send("Not Found") : res.send(result.rows))
    .catch(next);
});


app.post("/pets", (req, res, next) => {
  const { name, kind, age } = req.body;
  
  if (!name || !kind || !age || !Number.isInteger(Number(age))) {
    res.status(400).set("Content-Type", "text/plain").send("Bad Request");
  } else {
    petshopdb.query("INSERT INTO petshop (name, kind, age) VALUES ($1, $2, $3)", [name, kind, age])
    .then((result) => { res.send({age, kind, name}) })
    .catch(next);
  }
});


app.patch("/pets/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, kind, age } = req.body;

  if (!name || !kind || !age || !Number.isInteger(Number(age))) {
    res.status(400).set("Content-Type", "text/plain").send(`${req.method} | ${req.url} | ${JSON.stringify(req.body)} | Bad Request`);
  } else {
    petshopdb.query("UPDATE petshop SET name = $1, kind = $2, age = $3 WHERE id = $4", [name, kind, age, id])
      .then((result) => {
        if(result.rowCount === 0) {
          res.status(404).set("Content-Type", "text/plain").send(`PET ID "${id}" NOT FOUND`)
        } else {
          res.send( {name, kind, age} ) 
        }
      })
      .catch(next);
  }
});


app.delete("/pets/:id", (req, res, next) => {
  const { id } = req.params;
  let localPet = {};

  petshopdb.query("SELECT * FROM petshop WHERE id = $1", [id])
    .then((result) => {
      if(result.rowCount === 0) { 
        res.status(404).set("Content-Type", "text/plain").send(`PET ID "${id}" NOT FOUND`);
        next();
      } else {
        const {name, kind, age} = result.rows[0];
        localPet = {name: name, kind: kind, age: age}
      }
    })
    .then(()=> {
      petshopdb.query("DELETE FROM petshop WHERE id = $1", [id])
        .then((result) => {
          res.send(localPet);
        })  
        .catch(next);
    })
    .catch(next);

});


app.use("/*", (req, res) => {
  res.status(404).set("Content-Type", "text/plain").send("Not Found");
})


app.use(function errorHandler (error, req, res, next) {
  console.error(error.message, error.stack);
  res.status(500).set('Content-Type', 'text/plain').send('Internal Server Error');
});


app.listen(expressPort, () => {
  console.log("Listening on port 8000...");
});




/*
function logger(req, res, next) {
  console.log("Request Method: ", req.method);
  console.log("Request Path: ", req.url);
  next();
}
*/
