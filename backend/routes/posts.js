const Post = require('../models/post');
const express = require('express');
const router = express.Router();

const multer = require('multer');

const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValidMimeType = MIME_TYPE[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValidMimeType) {
      error = null;
    }
    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join("-");
    const extension = MIME_TYPE[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + extension);
  }
});

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" +req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch(() => {
    console.log('Error Occured');
  })
});

router.get("", (req, res, next) => {
  const page = +req.query.page;
  const pageLimit = +req.query.pageLimit;
  const postQuery = Post.find();
  let fetchedPosts;
  if (page && pageLimit) {
    postQuery.skip(pageLimit * (page - 1)).limit(pageLimit);
  }
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
  }).then(totalPosts => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: totalPosts
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

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = "";
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" +req.file.filename;
  } else {
    imagePath = req.body.imagePath;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);

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
