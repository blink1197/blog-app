const Post = require("../models/post.model.js");
const AppError = require("../utils/AppError.js");


module.exports.addPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        if (!title || !content) throw new AppError("Missing required fields", 400);

        const post = await Post.create({
            title,
            content,
            userId,
        });

        res.status(201).json(post);

    } catch (error) {
        next(error)
    }
}

module.exports.getPosts = async (req, res, next) => {
    try {

        const posts = await Post.find({});

        res.status(200).json({ posts });

    } catch (error) {
        next(error)
    }

}

module.exports.getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            throw new AppError("Post not found", 404);
        }

        res.status(200).json(post);

    } catch (error) {
        next(error);
    }
};


module.exports.updatePost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const { postId } = req.params;
        const userId = req.user.id;

        // Find post
        const post = await Post.findOne({ _id: postId, userId });
        if (!post) throw new AppError("Post not found or unauthorized", 404);


        // Update only provided fields
        if (title) post.title = title;
        if (content) post.content = content;

        await post.save();

        res.status(200).json({
            message: "Post updated successfully",
            updatedPost: post._doc
        });
    } catch (error) {
        next(error);
    }
}

module.exports.deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.isAdmin;

        let deletedPost;

        if (isAdmin) {
            // Admin can delete any post
            deletedPost = await Post.findByIdAndDelete(postId);
        } else {
            // Normal user can delete only their own post
            deletedPost = await Post.findOneAndDelete({
                _id: postId,
                userId: userId
            });
        }

        if (!deletedPost) {
            throw new AppError("Post not found or unauthorized", 404);
        }

        res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports.addComment = async (req, res, next) => {
    try {
        const { comment } = req.body;
        const { postId } = req.params;
        const userId = req.user.id;

        if (!comment) {
            throw new AppError("Comment should not be empty", 400);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        userId,
                        comment: comment || ''
                    }
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            throw new AppError("Post not found", 404);
        }

        res.status(200).json({
            message: "Comment added successfully",
            updatedPost
        });

    } catch (error) {
        next(error);
    }
}

module.exports.deleteComment = async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;

        // Remove the comment from the comments array
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                $pull: {
                    comments: { _id: commentId }
                }
            },
            { new: true } // return updated document
        );

        if (!updatedPost) {
            throw new AppError("Post not found", 404);
        }

        res.status(200).json({
            message: "Comment deleted successfully",
            updatedPost
        });

    } catch (error) {
        next(error);
    }
};