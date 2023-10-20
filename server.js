//env
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//libriaries
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
//for  auth middleware
const RefreshToken = require('./models/refreshToken')
const jwt = require('jsonwebtoken')
const user = require('./models/user')

//app object
const app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayout)
app.use(express.static(__dirname +'/public'))
app.use(bodyParser.urlencoded( { limit: '10mb', extended: false }))
app.use(express.json()) //so app can use json passed from body
app.use(cookieParser())
app.use(methodOverride('_method'))


//database
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => {
    console.error(error)
})
db.once('open', () => {
    console.log("Connected to Mongoose")
})

//routes
const loginRouter = require('./routes/loginPage')
const homeRouter = require('./routes/home')
const loadPostsAPI = require('./routes/API/loadPosts')

app.use('/', loginRouter)
app.use('/home', authenticateToken, homeRouter)
app.use('/API', loadPostsAPI)

//start
app.listen(process.env.PORT || 3000)

//middleware
async function  authenticateToken (req, res, next){
    const token = req.cookies.accessToken
    if(token == null) return res.sendStatus('401')
    jwt.verify(token, process.env.ACCESS_TOKEN_JWT, (err, user) => {
        if(err){
            refreshToken(req, res)
            next()
        }else{
            req.user = user
            next()
        }
      })
    }

async function refreshToken (req, res){
    const refreshToken = req.cookies.refreshToken
    if(refreshToken == null) return res.sendStatus('401')
    if(RefreshToken.countDocuments({refreshToken: user.refreshToken})!== 0){
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_JWT, (err, user) => {
            if(err) return res.sendStatus(403)
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_JWT)
            res.cookie("accessToken", accessToken)
            req.user = user
            return true
          })
    }else{return false}
}