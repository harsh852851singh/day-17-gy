const Post = require("../models/Post")

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Both Title and Content are required"
            })
        }

        const post = await Post.create({ title, content, user: req.user._id });
        res.status(201).json({
            success: true,
            message: "Post Saved",
            post
        });
    }
    catch (err) {
        console.log("Unable to Add Post", err);
        res.status(500).json({
            success: false,
            message: "Create Post Error",
            error: err.message
        });
    }
};


const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().populate("user","name email");
        res.status(201).json({
            success: true,
            message: "All Posts",
            total: posts.length,
            posts
        })
    }
    catch (err) {
        console.log("Unable to Fetch Post", err);
        res.status(500).json({
            success: false,
            message: "Unable to Fetch Posts",
            error: err.message
        })
    }
};

const getMyPost = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id });
        res.status(201).json({
            success: true,
            message: "Your Posts",
            posts
        });
    }
    catch (err) {
        console.log("Unable to get Your Post", err);
        res.status(500).json({
            success: false,
            message: "Unable to get your Post"
        });
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        // const {title,}
        const post = await Post.findById(id);
        if (!post) {
            return res.status(401).json({
                success: false,
                message: "Post Not Found to Update"
            });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own Post"
            })
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        await post.save();

        res.status(201).json({
            success: true,
            message: "Post Updated Successfully",
            post
        })

    }
    catch (err) {
        console.log("Unable to Update Post", err);
        res.status(500).json({
            success: false,
            message: "Unable to Update Post"
        });

    }
};


const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(401).json({
                success: false,
                message: "Post Not Found to Delete"
            });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own Post"
            })
        }

        await post.deleteOne();

        res.status(201).json({
            success: true,
            message: "Post Deleted Successfully",
        })

    }
    catch (err) {
        console.log("Unable to Delete Post", err);
        res.status(500).json({
            success: false,
            message: "Unable to Delete Post"
        });

    }
};



module.exports = { createPost, getAllPost, getMyPost, updatePost, deletePost };