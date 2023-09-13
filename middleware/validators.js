const usersDB = require("../schemas/userSchema");

module.exports = {
    validateUser: async (req, res, next) => {
        const {username, pass1,pass2} = req.body;
        if(!username) return res.send({error:true, data: null, message: 'username cannot be empty'});
        if(!pass1) return res.send({error:true, data: null, message: 'password cannot be empty'});
        if(pass1 !== pass2) return res.send({error:true, data: null, message: 'passwords should match'});
        const foundUser = await usersDB.findOne({username});
        console.log('foundUser', foundUser);
        if (foundUser) return res.send({error: true, data: null, message: 'Username already exists'});
        // res.send({ok: 'validation ok'});
        next();
    }
}