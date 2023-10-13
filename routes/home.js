if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const Post = require('../models/post')
const jwt = require('jsonwebtoken')


const router = express.Router()

router.get('/', async (req, res) => {
    let posts
    try{
        posts = await Post.find().limit(5).sort({ editedAt: -1 })
        res.render('home.ejs', { posts: posts })
    }catch(err){
        console.error(err)
    }
})

router.post('/newPost', authenticateToken, async (req, res) => {
    if(req.body.newPost !== ""){
        console.log('/newPost:' + req.user)
        const post = new Post({
            postText: req.body.newPost,
            user: req.user
        })
        try{
            await post.save()
            console.log(req.user)
            res.redirect("/home")
            return
        }catch(err){
            console.error(err)
            res.redirect('/home')
            return
        }
    }
    else{
        res.redirect("/home")
        return
    }
})

async function  authenticateToken (req, res, next){
    const token = req.cookies.accessToken
    console.log(token)
    //if (token == null) return res.sendStatus(403)
    if(token == null) return res.sendStatus('401')
    jwt.verify(token, process.env.ACCESS_TOKEN_JWT, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
      })
    /* const accessToken = req.cookies.accessToken
    console.log(req.headers)
    const authHeader = req.headers['authorization']
    console.log("New Line")
    console.log(authHeader)
    //authHeader && authHeader.split(' ')[1] means:
    //if authHeader exists return authHeader.split(' ')[1]
    //otherwise return undefined
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus('401')
    jwt.verify(token, proccess.env.ACCESS_TOKEN_JWT, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next() */
    }


module.exports = router