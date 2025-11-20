const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        comment: {
            type: String,
            trim: true
        },
    },
    {
        timestamps: true
    }
);

// Main post schema
const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        },

        comments: {
            type: [commentSchema],
            default: []
        }
    },
    {
        timestamps: true,
        collection: 'posts'

    }
);

module.exports = mongoose.model("Post", postSchema);
