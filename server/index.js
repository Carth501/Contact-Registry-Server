// server/index.js
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());

const jsonParser = bodyParser.json();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "newuser",
  password: "ZK#9Q&mBN"
});

const sql = `SELECT * FROM sakila.actor LIMIT 3`;

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + JSON.stringify(result));
    });
  }); 

app.use(
    cors({
        origin: '*',
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        exposedHeaders: ["X-SESSION-TOKEN"]
    })
);

app.post('/api/contact', jsonParser, function (req, res) {
    console.log(req.body);
    
    const cols = 'phone, registrationtexts, registrationcalls, electiontexts, electioncalls';
    const args = [
      req.body.phoneNumber, 
      req.body.registrationTexts, 
      req.body.registrationCalls, 
      req.body.electionTexts, 
      req.body.electionCalls
    ];
        
    con.query(`INSERT INTO data.records (${cols}) VALUES (?, ?, ?, ?, ?)`, args, function (err, result) {
      if (err) throw err;
      console.log("Result: " + JSON.stringify(result));
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});