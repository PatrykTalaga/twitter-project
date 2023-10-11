const express = require('express')
const User = require('../models/user')

const router = express.Router()

router.get('/', async (req, res) => {
    res.render('loginPage.ejs')
})

router.get('/noLogin',  (req, res) => {
    res.redirect('/home')
})

router.get('/newUser', (req, res) => {
    res.render('newUser.ejs')
})

router.route('/newUser')
    .get((req, res) => {
        res.render('newUser.ejs')
    })
    .post(async (req, res) => {

        //Check if email or username is already in database
        if(await User.countDocuments({userName: req.body.username}) !== 0 ||
        await User.countDocuments({email: req.body.email}) !== 0) {
            res.send("UserEXists")
            return
        }

        const user = new User({
            userName: req.body.username,
            userPassword: req.body.password,
            email: req.body.email,
            settings: ["light mode", 1.25, "blue"]
        })
        try{
            await user.save()
            res.send("New User Saved")
        }catch(err){
            console.error(err)
        }
    })

module.exports = router