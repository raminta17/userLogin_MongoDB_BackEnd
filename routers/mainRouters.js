const express = require('express');
const router = express.Router();

const {validateUser} = require('../middleware/validators')

const {
    register,
    login,updatePhoto,savePost} = require('../controllers/mainControllers');

router.post('/register', validateUser, register);
router.post('/login', login);
router.post('/updatePhoto', updatePhoto);
router.post('/savePost', savePost);

module.exports = router;