const mongoose = require('mongoose')
const path = require('path')

//variables//
const postImageBasePath = 'uploads/postImages'
//necessary to include virtual properties in JSON
const opts = { toJSON: { virtuals: true } }

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
}, opts)

//virtuals//
postsSchema.virtual('postImagePath').get(function(){
    if(this.postImageName != null){
        return path.join('/', postImageBasePath, this.postImageName)
    }
})

//exports//
module.exports = mongoose.model('Posts', postsSchema)
module.exports.postImageBasePath = postImageBasePath