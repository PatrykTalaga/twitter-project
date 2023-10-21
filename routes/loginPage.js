if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const RefreshToken = require('../models/refreshToken')

const accessTime = '5min'
const refreshTime = '3h'

const router = express.Router()


router.route('/')
    .get((req, res) => {
        res.render('loginPage.ejs')
    })
    .post(async (req, res) => {
        const user = await User.findOne({ username : req.body.username})
        if(user == null){
            console.log('Username is incorrect')
            return res.status(400).render('loginPage.ejs', {
                errorMessage: 'Username is incorrect',
                username: req.body.username }
            )
        }
        try{
            if(bcrypt.compare(req.body.password, user.password)){
                const jUser = user.toJSON() //jwt.sign needs json, not mongoose object
                delete jUser.password //remove password (don't add it to jwt)
                const refreshToken = jwt.sign(jUser, process.env.REFRESH_TOKEN_JWT, {expiresIn: refreshTime})
                const accessToken = jwt.sign(jUser, process.env.ACCESS_TOKEN_JWT, {expiresIn: accessTime})

                //Save refresh token to DB
                if(await RefreshToken.countDocuments({user: req.body.username}) !== 0){
                    await RefreshToken.findOneAndUpdate({user: req.body.username}, {refreshToken: refreshToken})

                }else{
                    const refreshTokenDB = new RefreshToken({
                        user: user.username,
                        refreshToken: refreshToken
                    })
                    await refreshTokenDB.save()
                }
                ///
                res.cookie("accessToken", accessToken).cookie("refreshToken", refreshToken).cookie("userId", jUser._id.toJSON()).redirect('/home')
            }
            else{
                return res.status(400).render('loginPage.ejs', {
                    errorMessage: 'Password is incorrect',
                    username: req.body.username })
            }
        }
        catch(err){
            console.error(err)
            res.redirect('/')
        }
        
    })

/* router.get('/noLogin',  (req, res) => {
    res.redirect('/home')
}) */

router.route('/newUser')
    .get((req, res) => {
        res.render('newUser.ejs')
    })
    .post(async (req, res) => {
        //Check if email or username is already in database
        if(await User.countDocuments({username: req.body.username}) !== 0){
            return res.status(400).render('newUser.ejs', {
                errorMessage: 'This username is already registered',
                username: req.body.username,
                password: req.body.password,
                email: req.body.email })
        }
        if(await User.countDocuments({email: req.body.email}) !== 0) {
            return res.status(400).render('newUser.ejs', {
                errorMessage: 'This e-mail is already registered',
                username: req.body.username,
                password: req.body.password,
                email: req.body.email })
        }

        //hash password
        try{
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const user = new User({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                settings: ["light mode", 1.25, "blue"]
            })

            try{
                await user.save()
//****Start of: Auto-Login - no checks because this data was just added to database**********//
                const jUser = user.toJSON()
                const accessToken = jwt.sign(jUser, process.env.ACCESS_TOKEN_JWT)
                res.cookie("accessToken", accessToken).redirect('/home')
//******End of: Auto-Login - no checks becouse this data was just added to database**********//
                }catch(err){ //save to database
                    console.error(err)
                    res.redirect('/')
                }
    }catch(err){ //bcrypt hash password
        console.error(err)
    }
})

module.exports = router