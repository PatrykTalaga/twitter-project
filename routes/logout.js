const express = require('express')
const RefreshToken = require('../models/refreshToken')
//middleware//
const authenticateToken = require('../middleware/authenticate')

const router = express.Router()

router.post('/', authenticateToken, async (req, res) => {
    try{
        const userName = req.user.username
        await RefreshToken.deleteOne({ user: userName })
        console.log('deleted: ' + userName)
        //clear cookies from browser as well
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.redirect('/')
    }catch(err){
        console.error(err)
    }
})

module.exports = router