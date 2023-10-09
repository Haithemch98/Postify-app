const db = require("../models/model")

const addPosty = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;  // Assuming you have authentication middleware setting req.user

        if (!title) {
            return res.status(400).json({ status: false, message: "Title is required" });
        }

        if (!content && !req.file) {
            return res.status(400).json({ status: false, message: "Content or Image is required" });
        }


        const newPost = new db.Post({
            title,
            content,
            author: userId,
        });

        if (req.file) {
            newPost.image = req.file.filename;
        }

        await newPost.save();
        res.status(201).json({
            status: true,
            data: newPost
        });
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


const getPost = async (req, res) => {
    try {
        const post = await db.Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const user = await db.User.findById(post.author);

        const newPost = {
            _id: post._id,
            title: post.title,
            content: post.content,
            image: post.image,
            createdAt: post.createdAt,
            author: user.username,
            authorPicture: user.profileImage
        };
        console.log(newPost)
        res.status(200).json({data :newPost});
    } catch (error) {
        console.error('Error getting post:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


const getAllPosts = async (req, res) => {
    try {
        const posts = await db.Post.find()

        const transformedPosts = await Promise.all(posts.map(async post => {
            const { _id, title, content, image, createdAt, author } = post;
            const user = await db.User.findById(author);
            console.log(user)
            return {
                _id,
                title,
                content,
                image,
                createdAt,
                author: user.username,
                authorPicture: user.profileImage
            };
        }));

        res.status(200).json(transformedPosts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};



const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await db.Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this post' });
        }

        post.title = title;
        post.content = content;
        if (req.file) {
            post.image = req.file.filename;
        }


        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const post = await db.Post.findById(postId);
        const user = await db.User.findById(userId)
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (userRole === 'Admin' || post.author.toString() === userId) {
            await db.Post.deleteOne({ _id: post._id });
            await db.Comment.deleteMany({ post: post._id })
            return res.status(200).json({ message: 'Post deleted successfully' });
        }

        return res.status(403).json({ error: 'Not authorized to delete this post' });

    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



module.exports = {
    addPosty,
    getPost,
    deletePost,
    updatePost,
    getAllPosts,
}