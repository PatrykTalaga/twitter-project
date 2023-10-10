//env
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//libriaries
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//app object
const app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayout)
app.use(express.static('public'))
app.use(bodyParser.urlencoded( { limit: '10mb', extended: false }))

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
const homeRouter = require('./routes/home')

app.use('/', homeRouter)


//start
app.listen(process.env.PORT || 3000)