if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
//libriaries//
const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
//modules//
const Post = require('../models/post')
//variables//
const searchLimit = 25

//middleware//
const authenticateToken = require('../middleware/authenticate')

//Multer + rename file
const uploadPath = path.join('public', Post.postImageBasePath)
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, uploadPath)
        },
    filename: function(req, file, callback) {
        callback(null, req.user._id + '-' + Date.now() + path.extname(file.originalname))
        }
})
const upload = multer({ storage: storage })

//Router//
const router = express.Router()

router.get('/', authenticateToken, async (req, res) => {
    res.render('home.ejs', { userId: req.user._id })
})

router.post('/newPost', authenticateToken, upload.single('postImage'), async (req, res) => {
    //Check if image was uploaded and create path to the image on server
    const imageName = req.file != null ? req.file.filename : null
    let imagePath
    if(imageName != null){
        imagePath = path.join('public/uploads/postImages', imageName)
    }

    //Save post to database if textarea was not empty
    if(req.body.newPost !== ""){
        //quick fix to not block server if authentication middleware fails
        if(req.user == undefined){
            return
        }

        let post = new Post({
            postText: req.body.newPost,
            user: req.user.username,
            userId: req.user._id,
            createdAt: new Date(), //if you not add date here it will default to the date 
            editedAt: new Date()  //you opend page/required model, not the date you saved post
        })
        //add postImageName only if image was uploaded
        if(imageName != null) post.postImageName = imageName

        try{
            await post.save()
            return res.redirect("/home")
        }catch(err){
            console.error(err)
            //Delete image from server if post was not saved in database
            deleteFile(imagePath)
            return res.redirect('/home')
        }
    }
    else{
        //Delete image from server if textarea was empty (there is no post to save)
        if(imageName != null) deleteFile(imagePath)
        return res.redirect("/home")
    }
})

router.route('/editPost/:id')
    .get(authenticateToken, async (req, res) => {
        const id = req.params.id
        try{
            const post = await Post.findOne({ _id: id })
            res.render('editPost.ejs', { post : post })
        }catch(err){
            console.error(err)
        }
        
    })
    .post(authenticateToken, upload.single('postImage'), async (req, res) => {
        const imageName = req.file != null ? req.file.filename : null
        const id = req.params.id
        if(req.body.editPost !== ""){
            try{
                let post = await Post.findOne({ _id: id })
                post.postText = req.body.editPost
                post.editedAt = new Date()

                //delete old image if new is sent
                const deleteImagePath = post.imagePath
                if(imageName != null){
                    if(deleteImagePath != null) deleteFile(deleteImagePath)
                    post.postImageName = imageName
                }

                await post.save()
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

router.delete('/deletePost/:id', authenticateToken, async (req, res) => {
    try{
        const id = req.params.id
        //delete image
        let post = await Post.findOne({ _id: id })
        if(post.imagePath != null) deleteFile(post.imagePath)
        //delete post
        await Post.deleteOne({ _id: id })
        res.redirect('/home')
    }catch(err){
        console.error(err)
    }
})

router.post('/search/', authenticateToken, async (req, res) => {
    try{
        const searchParameters = req.body.search
        
        if((await Post.find({ user: searchParameters })).length == 0){
            //search for posts
            const posts = await Post.find({ postText: { "$regex": searchParameters, "$options": "i" } }).limit(searchLimit)
            if(posts.length != 0){
                res.render('searchResults.ejs', 
                {
                    posts: posts,
                    userId : req.user._id,
                    searchParameters: searchParameters
                })
            }else{
                res.render('home.ejs', { searchError: 'Nothing found'})
            }
        }else{
            //search for users
            const posts = await Post.find({ user: searchParameters }).limit(searchLimit)
            res.render('searchResults.ejs', 
                {
                    posts: posts,
                    userId : req.user._id,
                    searchParameters: searchParameters
                })
        }

    }catch(err){
        console.error(err)
        res.render('home.ejs', { searchError: 'Server error'})
    }
})

//functions//
//remove image file from server
function deleteFile(imagePath){
    fs.unlink(imagePath, function (err) {
        if (err) throw err
        console.log('File deleted!')
      })
}

module.exports = router