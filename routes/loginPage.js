if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//libriaries//
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//modules//
const RefreshToken = require('../models/refreshToken')

//variables//
const accessTime = '15min'
const refreshTime = '3h'

//router//
const router = express.Router()
router.route('/')
    .get((req, res) => {
        res.render('loginPage.ejs', {layout: false})
    })
    .post(async (req, res) => {
        const user = await User.findOne({ username : req.body.username})
        if(user == null){
            console.log('Username is incorrect')
            return res.status(400).render('loginPage.ejs', {
                layout: false,
                errorMessage: 'Username is incorrect',
                username: req.body.username }
            )
        }
        try{
            if(bcrypt.compare(req.body.password, user.password)){
                const jUser = user.toJSON() //jwt.sign needs json, not mongoose object
                delete jUser.password //remove password (you don't wat to add it to jwt)
                const refreshToken = jwt.sign(jUser, process.env.REFRESH_TOKEN_JWT, {expiresIn: refreshTime})
                const accessToken = jwt.sign(jUser, process.env.ACCESS_TOKEN_JWT, {expiresIn: accessTime})

                //Save refresh token to DB or replace it if user:token pair already exists
                if(await RefreshToken.countDocuments({user: req.body.username}) !== 0){
                    await RefreshToken.findOneAndUpdate({user: req.body.username}, {refreshToken: refreshToken})
                }else{
                    const refreshTokenDB = new RefreshToken({
                        user: user.username,
                        refreshToken: refreshToken
                    })
                    await refreshTokenDB.save()
                }
                //Send both tokens back as cookies, as well as username (necessary in loadPostsScript.js)
                res.cookie("accessToken", accessToken, {overwrite: true}).cookie("refreshToken", refreshToken, {overwrite: true}).cookie("userId", jUser._id.toJSON()).redirect('/home')
            }
            else{
                return res.status(400).render('loginPage.ejs', {
                    layout: false,
                    errorMessage: 'Password is incorrect',
                    username: req.body.username })
            }
        }
        catch(err){
            console.error(err)
            res.redirect('/')
        }
        
    })

router.route('/newUser')
    .get((req, res) => {
        res.render('newUser.ejs', {layout: false})
    })
    .post(async (req, res) => {
        
        //Check if username is already in database
        if(await User.countDocuments({username: req.body.username}) !== 0){
            return res.status(400).render('newUser.ejs', {
                layout: false,
                errorMessage: 'This username is already registered',
                username: req.body.username,
                password: req.body.password,
                email: req.body.email })
        }
        //Check if email is already in database
        if(await User.countDocuments({email: req.body.email}) !== 0) {
            return res.status(400).render('newUser.ejs', {
                layout: false,
                errorMessage: 'This e-mail is already registered',
                username: req.body.username,
                password: req.body.password,
                email: req.body.email })
        }

        //hash password using bcrypt
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
//****Start of: Auto-Login - there are no checks because this data was just added to database**********//
                const jUser = user.toJSON()
                const accessToken = jwt.sign(jUser, process.env.ACCESS_TOKEN_JWT)
                const refreshToken = jwt.sign(jUser, process.env.REFRESH_TOKEN_JWT, {expiresIn: refreshTime})
                res.cookie("accessToken", accessToken, {overwrite: true}).cookie("refreshToken", refreshToken, {overwrite: true}).cookie("userId", jUser._id.toJSON()).redirect('/home')
//******End of: Auto-Login - there are no checks because this data was just added to database**********//
                }catch(err){ //save to database
                    console.error(err)
                    res.redirect('/')
                }
    }catch(err){ //bcrypt hash password
        console.error(err)
    }
})

//exports//
module.exports = router
module.exports.accessTime = accessTime //export variable