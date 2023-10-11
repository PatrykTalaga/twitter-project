const express = require('express')
const Post = require('../models/post')

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

router.post('/newPost', async (req, res) => {
    if(req.body.newPost !== ""){
        const post = new Post({
            postText: req.body.newPost
        })
        try{
            await post.save()
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

module.exports = router