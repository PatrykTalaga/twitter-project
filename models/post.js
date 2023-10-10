const mongoose = require('mongoose')

const postsSchema = new mongoose.Schema({
    user: {
        type: String,
        default: "Unregistered user"
    },
    userId: {
        type: String,
        default: "User Id"
    },
    postText: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
        immutable: true
    },
    editedAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('Posts', postsSchema)