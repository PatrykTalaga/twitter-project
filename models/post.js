const mongoose = require('mongoose')
const path = require('path')

const postImageBasePath = 'uploads/postImages'

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
    postImageName: {
        type: String,
        default: null
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

postsSchema.virtual('postImagePath').get(function(){
    if(this.postImageName != null){
        return path.join('/', postImageBasePath, this.postImageName)
    }
})

module.exports = mongoose.model('Posts', postsSchema)
module.exports.postImageBasePath = postImageBasePath