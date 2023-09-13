const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false,
        default: 'https://w0.peakpx.com/wallpaper/979/89/HD-wallpaper-purple-smile-design-eye-smily-profile-pic-face-thumbnail.jpg'
    },
    posts: {
        type: Array,
        required: false,
        default: []
    }
})

const user = mongoose.model('type16_usersRegistration', userSchema);

module.exports = user;