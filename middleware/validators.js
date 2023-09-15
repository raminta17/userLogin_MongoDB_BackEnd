const usersDB = require("../schemas/userSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    validateRegister: async (req, res, next) => {
        const {username, pass1, pass2} = req.body;
        if (!username) return res.send({error: true, data: null, message: 'username cannot be empty'});
        if (!pass1) return res.send({error: true, data: null, message: 'password cannot be empty'});
        if (pass1 !== pass2) return res.send({error: true, data: null, message: 'passwords should match'});
        const foundUser = await usersDB.findOne({username});
        console.log('foundUser', foundUser);
        if (foundUser) return res.send({error: true, data: null, message: 'Username already exists'});
        next();
    },
    validateLogin: async (req, res, next) => {
        const user = req.body;
        if (!user.username) return res.send({error: true, data: null, message: 'username cannot be empty'});
        if (!user.password) return res.send({error: true, data: null, message: 'password cannot be empty'});
        const foundUser = await usersDB.findOne({username: user.username})
        if (!foundUser) return res.send({error: true, data: null, message: 'User not found'});
        const isMatch = await bcrypt.compare(user.password, foundUser.password)
        if (!isMatch) return res.send({
            error: true,
            data: null,
            message: 'Password is incorrect'
        });
        next();
    },
    checkToken: (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) return res.send({error: true, data: null, message: 'Token from front end error'});
        jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
            if (error) {
                return res.send({error: true, data: null, message: 'User not found in middleware'});
            }
            console.log('data back after token verification', data);
            req.user = data;
        })
        next();
    }
}