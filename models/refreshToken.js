const mongoose = require('mongoose')

const jwtSchema = new mongoose.Schema({
    user: {
        type: String,
    },
    refreshToken: {
        type: String,
    }
})

module.exports = mongoose.model('RefreshTokens', jwtSchema)