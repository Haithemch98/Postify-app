const router = require('express').Router();
const postController = require('../controller/post');
const { verifyToken } = require('../middleware/authorization');
const upload = require('../middleware/upload');



router.post('/', upload.postsImages.single('file'), verifyToken, postController.addPosty);


router.get('/:id', postController.getPost);


router.get('/', postController.getAllPosts);


router.put('/:id', upload.postsImages.single('file'), verifyToken, postController.updatePost);


router.delete('/:id', verifyToken, postController.deletePost);

module.exports = router;
