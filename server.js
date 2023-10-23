//env//
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//libriaries//
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')

//app object
const app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayout)
app.use(express.static(__dirname +'/public'))
app.use(bodyParser.urlencoded( { limit: '10mb', extended: false }))
app.use(express.json())
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

//middleware//
const authenticateToken = require('./middleware/authenticate')

//routes
const loginRouter = require('./routes/loginPage')
const homeRouter = require('./routes/home')
const loadPostsAPI = require('./routes/API/loadPosts')
const logout = require('./routes/logout')
const settings = require('./routes/settings')

app.use('/', loginRouter)
app.use('/home', authenticateToken, homeRouter)
app.use('/API', loadPostsAPI)
app.use('/logout', logout)
app.use('/settings', authenticateToken, settings)

//start//
app.listen(process.env.PORT || 3000)
