const Post = require('../models/post');
const express = require('express');
const router = express.Router();

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  }).catch(() => {
    console.log('Error Occured');
  })
});

router.get("", (req, res, next) => {
  const posts = Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then((response) => {
    res.status(200).json({
      message: 'Post deleted'
    });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then((result) => {
    res.status(200).json({
      message: 'Post Updated'
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json({post: post, message: "Post found"});
    } else {
      res.status(404).json({ post: null, message: "Post not found"});
    }
  });
});

module.exports = router;
