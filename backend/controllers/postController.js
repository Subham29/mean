const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" +req.file.filename,
    creator: req.userData.userId
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
    res.status(500).json({
      message: 'Error occured while adding post'
    });
  })
}

exports.fetchAllPosts = (req, res, next) => {
  const page = +req.query.page;
  const pageLimit = +req.query.pageLimit;
  const postQuery = Post.find();
  let fetchedPosts;
  if (page && pageLimit) {
    postQuery.skip(pageLimit * (page - 1)).limit(pageLimit);
  }
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.estimatedDocumentCount();
  }).then(totalPosts => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: totalPosts
    });
  }).catch(() => {
    res.status(500).json({
      message: 'Error occured while fetching posts'
    });
  });
}

exports.deletePostByIdAndCreator = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then((response) => {
    if (response.n > 0) {
      res.status(200).json({
        message: 'Post deleted'
      });
    } else {
      res.status(401).json({
        message: 'Not authorised to delete.'
      });
    }
  });
}

exports.updatePostByIdAndCreator = (req, res, next) => {
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
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);

  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then((result) => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'Post Updated'
      });
    } else {
      res.status(401).json({
        message: 'Not authorised to edit.'
      });
    }
  });
}

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json({post: post, message: "Post found"});
    } else {
      res.status(404).json({ post: null, message: "Post not found"});
    }
  });
}
