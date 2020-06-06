const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

const postRoutes = require('./routes/posts');

mongoose.connect('mongodb+srv://subhampatel29:vF5MxtHOpDDTmZo9@bonddata-wojmx.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connection successful');
  }).catch(() => {
    console.log(
      'Connection failed'
    );
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/posts', postRoutes);

module.exports = app;
