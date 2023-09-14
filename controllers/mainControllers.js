const usersDB = require('../schemas/userSchema');
const bcrypt = require('bcrypt');

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
        const {username, password} = req.body;
        const foundUser = await usersDB.findOne({username})
        if (!foundUser) return res.send({error: true, data: null, message: 'User not found'});
        const isMatch = await bcrypt.compare(password, foundUser.password)
        if (!isMatch) return res.send({
            error: true,
            data: null,
            message: 'Password is incorrect'
        });
        const userToFrontEnd = {
            _id: foundUser._id,
            username: foundUser.username,
            photo: foundUser.photo,
            posts: foundUser.posts
        }
        res.send({error: false, data: userToFrontEnd, message: 'Login success'});
    },
    updatePhoto: async (req,res) => {
        const {id, photo} = req.body;
        const updateUser = await usersDB.findOneAndUpdate(
            {_id:id},
            {$set: {photo: photo}},
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
        const userPost = req.body;
        console.log(userPost);
        const findUser = await usersDB.findOne({_id: userPost.id});
        if(!findUser) return res.send({error: true, data: null, message: 'user not found'});
        const updateUser = await usersDB.findOneAndUpdate(
            {_id: userPost.id},
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
        const {id, title} = req.body;
        const foundUser = await usersDB.findOne({_id: id});
        if (!foundUser) return res.send({error: true, data: null, message: 'User not found'});
        const updateUser = await usersDB.findOneAndUpdate(
            {_id: id},
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
    }
}