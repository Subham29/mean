const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://subhampatel29:vF5MxtHOpDDTmZo9@bonddata-wojmx.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connection successful');
  }).catch(() => {
    console.log(
      'Connection failed'
    );
  });

const Post = require('./models/post');

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
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then((response) => {
    res.status(200).json({
      message: 'Post deleted'
    });
  });
});

module.exports = app;
