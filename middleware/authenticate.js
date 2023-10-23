const jwt = require('jsonwebtoken')
//modules//
const RefreshToken = require('../models/refreshToken')
const User = require('../models/user')
const loginRouter = require('../routes/loginPage')
const accessTime = loginRouter.accessTime

async function  authenticateToken (req, res, next){
    console.log('******************auth')
    const token = req.cookies.accessToken
    if(token == null) return res.sendStatus('401')
    jwt.verify(token, process.env.ACCESS_TOKEN_JWT, async (err, user) => {
        if(err){
            console.log('wrong access token')
            
            
            const refreshToken = req.cookies.refreshToken
            if(refreshToken == null) return res.sendStatus('401')
            const userName = await User.findOne({_id: req.cookies.userId})
            console.log(userName.username)
            if( await RefreshToken.countDocuments({user: userName.username}) == 0) return res.redirect('/')
            console.log('-----')
             
            console.log('RefreshToken.countDocuments({refreshToken: user.refreshToken})!== 0)')
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_JWT, async (err, user) => {

                    const userDb = await User.findOne({ username : user.username})
                    let jUser = userDb.toJSON() //jwt.sign needs json, not mongoose object
                    delete jUser.password //remove password (you don't wat to add it to jwt)



                    const accessToken = jwt.sign(jUser, process.env.ACCESS_TOKEN_JWT, {expiresIn: accessTime})
                    res.cookie("accessToken", accessToken, {overwrite: true})
                    req.user = jUser
                    console.log('*Im here')
                    next()
                })

            
        }else{
            console.log('correct access token')
            req.user = user
            next()
        }
      })
    }

//functions//
/* async function refreshToken (req, res){
    const refreshToken = req.cookies.refreshToken
    if(refreshToken == null) return res.sendStatus('401')
    if(RefreshToken.countDocuments({refreshToken: User.refreshToken})!== 0){
        console.log('RefreshToken.countDocuments({refreshToken: user.refreshToken})!== 0)')
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_JWT, async (err, user) => {
            console.log('******************************')
            console.log(user)
            console.log('******************************')
            const userDb = await User.findOne({ username : user.username})
            let jUser = userDb.toJSON() //jwt.sign needs json, not mongoose object
            delete jUser.password //remove password (you don't wat to add it to jwt)
            console.log(jUser)
            console.log('******************************')
            
            if(err) return res.sendStatus(403)
            
            
            const accessToken = jwt.sign(jUser, process.env.ACCESS_TOKEN_JWT, {expiresIn: accessTime})
            res.cookie("accessToken", accessToken, {overwrite: true})
            req.user = jUser
            
        
          })
    }else{return res.render('loginPage.ejs')}
} */

module.exports = authenticateToken