const express = require('express');
const { addPost, getPosts, getPostById, updatePost, deletePost } = require("../controllers/post.controller.js")
const { verify } = require("../middleware/auth.js");


const router = express.Router();

router.post("/add-post", verify, addPost);
router.get("/", getPosts);
router.get("/:postId", getPostById);
router.patch("/:postId", verify, updatePost);
router.delete("/:postId", verify, deletePost);


module.exports = router;