'use strict';

const cors = require("cors");
const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGESENDERID,
  appId: process.env.APPID
};

const fbapp = initializeApp(firebaseConfig);
const db = getFirestore(app);
const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json()); //am I still using this?

const jsonParser = bodyParser.json(); //am I still using this?

app.use(express.static(path.join(__dirname, '../react-app/build')));

app.use(
  cors({
    origin: '*',
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    exposedHeaders: ["X-SESSION-TOKEN"]
  })
);

app.post('/api/create_record_GCP_Fs', async function (req, res) {
  try {
    const docRef = await addDoc(collection(db, "users", req.body.phoneNumber), {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      zip: req.body.zip,
      phoneNumber: req.body.phoneNumber,
      registrationEmail: req.body.registrationEmail,
      registrationMail: req.body.registrationMail,
      registrationTexts: req.body.registrationTexts,
      registrationCalls: req.body.registrationCalls,
      electionEmail: req.body.electionEmail,
      electionMail: req.body.electionMail,
      electionTexts: req.body.electionTexts,
      electionCalls: req.body.electionCalls,
      datetime: Date.now()
    });
    res.send(docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

app.get('/api/data', async function (req, res) {
  const querySnapshot = await getDocs(collection(db, "users"));
  const docs = [];
  querySnapshot.forEach((doc) => {
    docs.push(doc.data())
  });
  res.send(docs);
});

app.post('/api/newCustomer', async function (req, res) {
  let apikey = Math.round(Math.random() * 10000000000);
  try {
    const docRef = await addDoc(collection(db, "customer", req.body.name,), {
      apikey: apikey,
    });
    res.send(docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

app.post('/api/retrieve', async function (req, res) {
  const querySnapshot = await getDocs(collection(db, "users", req.body.phoneNumber));
  const docs = [];
  querySnapshot.forEach((doc) => {
    docs.push(doc.data())
  });
  res.send(docs);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});