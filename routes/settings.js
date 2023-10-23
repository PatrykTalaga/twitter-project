const express = require('express')
const User = require('../models/user')
const authenticateToken = require('../middleware/authenticate')

const router = express.Router()

router.route('/')
    .get(authenticateToken, (req, res) => {
        res.render('settings.ejs')
    })
    .post(authenticateToken, (req, res) => {
        res.redirect('/home')
    })

module.exports = router