const usersDB = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

module.exports = {
    register: async (req, res) => {
        const {username, pass1} = req.body;
        const hash = await bcrypt.hash(pass1, 13);
        const user = new usersDB({
            username: username,
            password: hash
      });
        user.save().then(() => {
            console.log('user added');
            res.send({error: false, data: null, message: 'User added successfully'});
        }).catch((e) => {
            console.log('error', e)
        })
    },
    login: async (req, res) => {
        const user = req.body;
        const foundUser = await usersDB.findOne({username: user.username})
        const userToFrontEnd = {
            _id: foundUser._id,
            username: foundUser.username,
            photo: foundUser.photo,
            posts: foundUser.posts
        }
        const token = jwt.sign(userToFrontEnd, process.env.JWT_SECRET);
        res.send({error: false, data: userToFrontEnd, token: token, message: 'Login success'});
    },
    updatePhoto: async (req,res) => {
        const user = req.user;
        const updatePhoto= req.body;
        console.log('user in controllers photo update', user);
        const updateUser = await usersDB.findOneAndUpdate(
            {_id: user._id},
            {$set: {photo: updatePhoto.photo}},
            {new: true}
        );
        console.log(updateUser);
        const userToFrontEnd = {
            _id: updateUser._id,
            username: updateUser.username,
            photo: updateUser.photo,
            posts: updateUser.posts
        }
        res.send({error: false, data: userToFrontEnd, message: 'Update success'});
    },
    savePost: async (req,res) => {
        const user = req.user;
        const userPost = req.body;
        const findUser = await usersDB.findOne({_id: user._id});
        if(!findUser) return res.send({error: true, data: null, message: 'user not found'});
        const findPostTitle = findUser.posts.find(post => post.title === userPost.title);
        if(findPostTitle) return res.send({error: true, data: null, message: 'Post with this title already exists'});
        const updateUser = await usersDB.findOneAndUpdate(
            {_id: user._id},
            {$push: {posts: {title: userPost.title, postImage: userPost.postImage}}},
            {new:true}
        )
        const userToFrontEnd = {
            _id: updateUser._id,
            username: updateUser.username,
            photo: updateUser.photo,
            posts: updateUser.posts
        }
        res.send({error: false, data: userToFrontEnd, message: 'post saved'});
    },
    deletePost: async (req,res) => {
        const user = req.user;
        const {id, title} = req.body;
        const foundUser = await usersDB.findOne({_id: user._id});
        if (!foundUser) return res.send({error: true, data: null, message: 'User not found'});
        const updateUser = await usersDB.findOneAndUpdate(
            {_id: foundUser._id},
            {$pull: {posts: {title: title}}},
            {new: true}
        )
        console.log(updateUser);
        const userToFrontEnd = {
            _id: updateUser._id,
            username: updateUser.username,
            photo: updateUser.photo,
            posts: updateUser.posts
        }
        res.send({error: false, data: userToFrontEnd, message: 'post deleted'});
    },
    sendUserInfo: (req,res) => {
        const user = req.user;
        res.send({error: false, data: user, message: 'post saved'});
    }
}