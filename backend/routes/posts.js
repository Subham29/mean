const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const fileExtractor = require('../middleware/fileExtractor');

const PostController = require('../controllers/postController');

router.post("", checkAuth, fileExtractor, PostController.createPost);

router.get("", PostController.fetchAllPosts);

router.delete("/:id", checkAuth, PostController.deletePostByIdAndCreator);

router.put("/:id",checkAuth, fileExtractor, PostController.updatePostByIdAndCreator);

router.get("/:id", PostController.getPostById);

module.exports = router;
