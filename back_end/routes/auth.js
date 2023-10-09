const router = require('express').Router()
const auth = require('../controller/auth')
const upload = require('../middleware/upload')

router.post('/login', auth.login)
router.post('/signup', upload.profilePicture.single('file'), auth.signup)


module.exports = router
