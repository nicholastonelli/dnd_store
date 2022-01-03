require('dotenv').config()

const express = require('express')
const app = express()
const PORT = 2000 //process.env.PORT
const SESSION_SECRET = process.env.SESSION_SECRET
const methodOverride = require('method-override')
const expressEjsLayout = require('express-ejs-layouts')
const itemsController = require('./controllers/items')
// const sessionsController = require('./controllers/sessions')
const session = require('express-session')

app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:false}));
app.use(expressEjsLayout)
app.set('view engine', 'ejs')

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

// Setting Controllers

app.use('/items',itemsController)

app.get('/', (req, res)=>{
    res.redirect('/items')
})

app.listen(PORT, ()=> console.log(`We're listening on port ${PORT}`))


