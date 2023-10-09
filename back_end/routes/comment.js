const router = require('express').Router();
const commentController = require('../controller/comment');
const { verifyToken } = require('../middleware/authorization');



router.post('/:postId', verifyToken, commentController.createComment);

router.get('/:postId', commentController.getAllCommentsForPost);

router.put('/:commentId', verifyToken, commentController.updateComment);

router.delete('/:commentId', verifyToken, commentController.deleteComment);

module.exports = router;
