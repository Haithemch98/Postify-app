const db = require('../models/model')

const createComment = async (req, res) => {
    try {
        const post = req.params.postId;
        const { text } = req.body
        const userId = req.user.id;

        if (!text) {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const newComment = new db.Comment({
            text,
            author: userId,
            post,
        });

        const savedComment = await newComment.save();
        await db.Post.updateOne({ _id: post }, {
            $push: {
                comments: savedComment._id
            },
        })
        res.status(201).json({ status: true, data: newComment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

const getAllCommentsForPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await db.Comment.find({ post: postId })
            .populate('author', 'username profileImage');
        const transformedComments = await Promise.all(comments.map(async comment => {
            const { _id, text, author, post, createdAt } = comment;
            const user = await db.User.findById(author);
            console.log(user)
            return {
                _id,
                text,
                post,
                createdAt,
                author: user.username,
                authorPicture: user.profileImage
            };
        }));
        res.status(200).json(transformedComments);
    } catch (error) {
        console.error('Error getting comments for post:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateComment = async (req, res) => {
    try {
        const { text } = req.body;
        const commentId = req.params.commentId;
        const userId = req.user.id;
        const comment = await db.Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this comment' });
        }

        comment.text = text;

        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id;
        const userRole = req.user.role;

        const comment = await db.Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const post = await db.Post.findById(comment.post);

        if (!post) {
            return res.status(404).json({ error: 'Associated post not found' });
        }

        if (userRole === 'Admin' || post.author.toString() === userId || comment.author.toString() === userId) {
            await db.Post.updateOne({ _id: post._id },
                {
                    $pull: {
                        comments: comment._id
                    }
                })
            await db.Comment.deleteOne({ _id: comment._id });
            return res.status(200).json({ message: 'Comment deleted successfully' });
        }

        return res.status(403).json({ error: 'Not authorized to delete this comment' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    getAllCommentsForPost,
    updateComment,
    deleteComment,
    createComment,
}