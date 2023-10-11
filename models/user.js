const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    userName: {
        type: String,
        /* required: true */
    },
    userPassword: {
        type: String,
    },
    email: {
        type: String,
    },
    settings: {
        type: Array
    },
    communities: {
        type: Array
    },
    friends: {
        type: Array
    },
    accountCreatedAt: {
        type: Date,
        default: new Date(),
        immutable: true
    },
    accountEditedAt: {
        type: Date,
        default: new Date(),
    }
})

module.exports = mongoose.model('Users', usersSchema)