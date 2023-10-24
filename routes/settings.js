const express = require('express')
const User = require('../models/user')
const authenticateToken = require('../middleware/authenticate')

const router = express.Router()

router.route('/')
    .get(authenticateToken, (req, res) => {
        res.render('settings.ejs')
    })
    .post(authenticateToken, async (req, res) => {
        try{
            let user = await User.findOne({ _id: req.user._id })

            //save to database only selected options
            if(req.body.background != undefined) user.settings[0] = req.body.background
            if(req.body.fontSize != undefined) user.settings[1] = req.body.fontSize
            if(req.body.color != undefined) user.settings[2] = req.body.color

            await user.save()
        }catch(err){console.error(err)}
        res.redirect('/settings')
    })



//API sent JSON containing user settings and user _id
router.get('/getSettings/:id', async (req, res) => {
    try{
        let settings = await User.find({ _id: req.params.id }, {settings: true})
        res.json(settings)
    }catch(err){
        console.error(err)
    }
})

module.exports = router
