const express = require('express')
const Post = require('../../models/post')

const router = express.Router()

router.get('/loadPosts/:limit/:skip/:filter', async (req, res) => {
    const limit = req.params.limit
    const skip = req.params.skip

    const filter = req.params.filter
    /* console.log('req.params.filter: ' + req.params.filter +' : '+ typeof(req.params.filter))
    console.log('filter: ' + filter +' : '+ typeof(filter))
    console.log('JSON.parse(filter): ' + JSON.parse(filter) +' : '+ JSON.parse(filter)) */
    
    let posts
    try{
        posts = await Post.find(JSON.parse(filter)).skip(skip).limit(limit).sort({ editedAt: -1 })
        res.json(posts)
    }catch(err){
        console.error(err)
    }
})

module.exports = router