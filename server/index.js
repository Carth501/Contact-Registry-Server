const cors = require("cors");
const express = require("express");
const { initializeApp } = require('firebase/app');
const { addDoc, collection, getFirestore } = require("firebase/firestore");
const path = require("path");
const url = require('url');
const bodyParser = require("body-parser");
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

const fbapp = initializeApp(firebaseConfig);

const app = express();
const db = getFirestore(fbapp);
const PORT = process.env.PORT || 3001;
const jsonParser = bodyParser.json();

app.use(express.static(path.join(__dirname, '../react-app/build')));

app.use(
  cors({
    origin: '*',
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    exposedHeaders: ["X-SESSION-TOKEN"]
  })
);

app.post('/api/create_record3', jsonParser, async function (req, res) {
  console.log(req.body);
  try {
    const docRef = await addDoc(collection(db, "records/users", req.body.phoneNumber), {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      zip: req.body.zip,
      phoneNumber: req.body.phoneNumber,
      registrationEmail: req.body.registrationEmail || null,
      registrationMail: req.body.registrationMail || null,
      registrationTexts: req.body.registrationTexts || null,
      registrationCalls: req.body.registrationCalls || null,
      electionEmail: req.body.electionEmail || null,
      electionMail: req.body.electionMail || null,
      electionTexts: req.body.electionTexts || null,
      electionCalls: req.body.electionCalls || null,
      datetime: Date.now()
    });
    res.send(docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

app.get('/api/data', jsonParser, async function (req, res) {
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