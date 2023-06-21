'use strict';

const cors = require("cors");
const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());

const jsonParser = bodyParser.json();

var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ZK#9Q&mBN"
});

const sql = `SELECT * FROM sys.records LIMIT 3`;

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sql, function (err, result) {
      if (err) throw err;
      //console.log("Result: " + JSON.stringify(result));
    });
  }); 

app.use(express.static(path.join(__dirname, '../react-app/build')));

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
      
  con.query(`INSERT INTO sys.records2 (${cols}) VALUES (?, ?, ?, ?, ?)`, args, function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
  });
});

app.get('/api/data', jsonParser, function(req, res) {
  const recordsRequest = `
  SELECT * FROM (
    SELECT *,if(@last_phone=phone,0,1) as new_phone_group,@last_phone:=phone
    FROM sys.records2 
    ORDER BY phone,creationtime DESC
  ) as t1
  WHERE new_phone_group=1;
  `;
  con.query(recordsRequest, function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
    res.send(result);
  });
});

app.post('/api/newCustomer', jsonParser, function (req, res) {
  const cols = 'name, apikey';
  let apikey = Math.round(Math.random() * 10000000000);
  const args = [req.body.name, apikey];

  con.query(`INSERT INTO sys.customers (${cols}) VALUES (?, ?)`, args, function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
    res.send({apikey: apikey});
  });
});

app.post('/api/retrieve', jsonParser, function (req, res) {
  const args = [req.body.uuid];

  con.query(`SELECT phone FROM sys.records2 WHERE guid = ?`,
  args, function (err, result) {
    if (err) throw err;
    res.send(result[0]);
  })
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});