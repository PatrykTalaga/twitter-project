if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const Post = require('../models/post')

//image upload
const path = require('path') //built-in library
const multer = require('multer')
const { type } = require('os')
const uploadPath = path.join('public', Post.postImageBasePath)
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']
/* console.log("uploadPath type: " + typeof(uploadPath)) */

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, uploadPath)
        },
    filename: function(req, file, callback) {
        callback(null, req.user._id + '-' + Date.now() + path.extname(file.originalname))
        }
})
//callback(null,  file.fieldname + '-' + Date.now() + path.extname(file.originalname))

const upload = multer({ storage: storage })

/* const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
}) */


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

router.post('/newPost', upload.single('postImage'), async (req, res) => {

    const imageName = req.file != null ? req.file.filename : null
    console.log("imageName: " + imageName)
    const imagePath = path.join('public/uploads/postImages', imageName)
   /*  console.log(" ")
    console.log(" ")
    console.log("imagePath " + imagePath)
    console.log(" ")
    console.log(" ") */

    if(req.body.newPost !== ""){
        if(req.user == undefined){
            return
        }

        const post = new Post({
            postText: req.body.newPost,
            user: req.user.username,
            userId: req.user._id,
            postImageName: imageName,
            //if you not add them here they will default with to the date 
            //you opend page/required model
            createdAt: new Date(),
            editedAt: new Date()
        })
        try{
            await post.save()
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

            res.render('editPost.ejs', { post : post })
        }catch(err){
            console.error(err)
        }
        
    })
    .post(async (req, res) => {
        const id = req.params.id
        if(req.body.editPost !== ""){
            try{
                let post = await Post.findOne({ _id: id })
                post.postText = req.body.editPost
                post.editedAt = new Date()
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

router.delete('/deletePost/:id', async (req, res) => {
    try{
        const id = req.params.id
        await Post.deleteOne({ _id: id })
        res.redirect('/home')
    }catch(err){
        console.error(err)
    }
})

module.exports = router