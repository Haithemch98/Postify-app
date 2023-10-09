const { verifyToken } = require('../middleware/authorization');
const router = require('express').Router()
const user = require ('../controller/user')


router.get('/my-posts',verifyToken ,user.getMyPosts);

router.get('/user-posts/:id', user.getUserPosts);

module.exports = router