if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



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
            if(await bcrypt.compare(req.body.password, user.password)){
                const accessToken = jwt.sign(user.username, process.env.ACCESS_TOKEN_JWT)
                //res.json({ accessToken : accessToken})
                /* res.cookie('accessToken', accessToken)
                res.redirect('/home') */
                /* res.set({accessToken: accessToken});
                res.redirect('/home') */
                res.cookie("accessToken", accessToken).redirect('/home')
            }
            else{
                res.send('Wrong Password')
            }
        }
        catch(err){
            console.error(err)
            res.redirect('/')
        }
        
    })

router.get('/noLogin',  (req, res) => {
    res.redirect('/home')
})

router.route('/newUser')
    .get((req, res) => {
        res.render('newUser.ejs')
    })
    .post(async (req, res) => {

        //Check if email or username is already in database
        if(await User.countDocuments({username: req.body.username}) !== 0 ||
        await User.countDocuments({email: req.body.email}) !== 0) {
            res.send("UserEXists")
            return
        }

        //hash password
        try{
            /* const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(req.body.password, salt) */
            //you dont have to generate salt manually, 10 at the end means generate salt with 10 rounds (10 is default)
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const user = new User({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                settings: ["light mode", 1.25, "blue"]
            })

            try{
                await user.save()
                res.send("New User Saved")
            }catch(err){
                console.error(err)
            }
        }catch(err){
            console.error(err)
        }
    })

module.exports = router