const jwt = require('jsonwebtoken')
//modules//
const RefreshToken = require('../models/refreshToken')
const User = require('../models/user')
const loginRouter = require('../routes/loginPage')
const accessTime = loginRouter.accessTime

async function  authenticateToken (req, res, next){
    const token = req.cookies.accessToken
    if(token == null) return res.sendStatus('401')
    jwt.verify(token, process.env.ACCESS_TOKEN_JWT, async (err, user) => {
        if(err){
            //access token expired check if refresh token exists, is valid and
            //is in database - there was no log out
            const refreshToken = req.cookies.refreshToken
            if(refreshToken == null) return res.sendStatus('401')
            const userDb = await User.findOne({_id: req.cookies.userId})
            if( await RefreshToken.countDocuments({user: userDb.username}) == 0) return res.redirect('/')
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_JWT, async (err, user) => {
                    let jUser = userDb.toJSON() //jwt.sign needs json, not mongoose object
                    delete jUser.password //remove password (you don't wat to add it to jwt)
                    const accessToken = jwt.sign(jUser, process.env.ACCESS_TOKEN_JWT, {expiresIn: accessTime})
                    res.cookie("accessToken", accessToken, {overwrite: true})
                    req.user = jUser
                    next()
                })
  
        }else{//access token didn't expired
            req.user = user
            next()
        }
      })
    }

module.exports = authenticateToken