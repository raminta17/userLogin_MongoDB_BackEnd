const express = require('express');
const router = express.Router();

const {validateRegister, validateLogin, checkToken} = require('../middleware/validators')

const {
    register,
    login,updatePhoto,savePost,deletePost, sendUserInfo} = require('../controllers/mainControllers');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/updatePhoto', checkToken, updatePhoto);
router.post('/savePost', checkToken, savePost);
router.post('/deletePost', checkToken, deletePost);
router.post('/getUserInfo', checkToken, sendUserInfo);

module.exports = router;