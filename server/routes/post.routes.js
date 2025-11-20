const express = require('express');
const {
    addPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    addComment,
    deleteComment
} = require("../controllers/post.controller.js");

const { verify, verifyAdmin } = require("../middleware/auth.js");

const router = express.Router();

// Posts
router.get("/", getPosts);
router.post("/", verify, addPost);

// Comments
router.post("/:postId/comments", verify, addComment);
router.delete("/:postId/comments/:commentId", verify, verifyAdmin, deleteComment);

// Single post
router.get("/:postId", getPostById);
router.patch("/:postId", verify, updatePost);
router.delete("/:postId", verify, deletePost);

module.exports = router;
