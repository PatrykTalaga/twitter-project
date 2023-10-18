if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const Post = require('../models/post')



const router = express.Router()

router.get('/', async (req, res) => {
    let posts
    try{
        posts = await Post.find().limit(5).sort({ editedAt: -1 })
        res.render('home.ejs', { posts: posts, userId: req.user._id })
    }catch(err){
        console.error(err)
    }
})

router.post('/newPost', async (req, res) => {
    if(req.body.newPost !== ""){
        if(req.user == undefined){
            return
        }

        console.log('/newPost:' + req.user)
        const post = new Post({
            postText: req.body.newPost,
            user: req.user.username,
            userId: req.user._id,
            //if you not add them here they will default with to the date 
            //you opend page/required model
            createdAt: new Date(),
            editedAt: new Date()
        })
        try{
            await post.save()
            console.log(req.user)
            return res.redirect("/home")
        }catch(err){
            console.error(err)
            return res.redirect('/home')
        }
    }
    else{
        return res.redirect("/home")
    }
})

router.route('/editPost/:id')
    .get(async (req, res) => {
        const id = req.params.id
        try{
            const post = await Post.findOne({ _id: id })
            console.log(post)
            res.render('editPost.ejs', { post : post })
        }catch(err){
            console.error(err)
        }
        
    })
    .post(async (req, res) => {
        const id = req.params.id
        if(req.body.editPost !== ""){
            console.log(req.body.editPost)
            try{
                let post = await Post.findOne({ _id: id })
                console.log("before " + post)
                post.postText = req.body.editPost
                post.editedAt = new Date()
                await post.save()
                console.log("after " + post)
                return res.redirect("/home")
            }catch(err){
                console.error(err)
                return res.redirect('/home')
            }
        }
        else{
            return res.redirect(`/editPost/${req.postId}`)
        }
    })

module.exports = router