const db = require('../models/model')


const getMyPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await db.Post.find({ author: userId });
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
        res.json(transformedPosts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const posts = await db.Post.find({ author: userId});
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}


module.exports = {
    getMyPosts,
    getUserPosts
};