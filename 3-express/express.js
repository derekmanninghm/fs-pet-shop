const express = require("express");
const app = express();
const fs = require('fs')
var port = 8000;

 //handles pets object without index 
app.get("/pets" , (req, res) => {
    fs.readFile("../pets.json", 'utf-8', (err, data)=>{      
        res.send(data);
    })
})

app.get("/pets/:index/" , (req, res) => {
    const { index } = req.params
    fs.readFile("../pets.json", 'utf-8', (err, data)=>{
        var petsObj = JSON.parse(data);
        if(petsObj[index] === undefined) {
            res.status(404).type('text/plain').send('Not Found')        
        }
        res.send(petsObj[index]);
        })
})

app.use(express.json())

app.post("/pets", (req, res)=>{
    fs.readFile("../pets.json", 'utf-8', (err, data)=>{
        var petsObj = JSON.parse(data);
        var reqObj = req.body;
        reqObj.age = Number(reqObj.age);

        if(reqObj.age === undefined || reqObj.name === undefined || reqObj.kind === undefined || !Number.isInteger(reqObj.age)) {
            res.status(400).type('text/plain').end("Bad Request");
        } else {
            petsObj.push(reqObj);

            fs.writeFile("../pets.json", JSON.stringify(petsObj) , function (err){
                if(err) res.status(404).type('text/plain').end('Not Found');
                
                res.status(201).type('application/json').send(req.body); 
            })
        }
    })  
})

app.listen(port, ()=> {
    console.log(`server is listening on port ${port}..`);
})