const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
// const PORT = (process.env.PORT || 2000)
app.set('port', process.env.PORT || 2000)
// const SESSION_SECRET = process.env.SESSION_SECRET
app.set('secret', process.env.SESSION_SECRET)
const methodOverride = require('method-override')
const expressEjsLayout = require('express-ejs-layouts')
const itemsController = require('./controllers/items')
const sessionsController = require('./controllers/sessions')
const session = require('express-session')
const Items = require('./models/items')

app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:false}));
app.use(expressEjsLayout)
app.set('view engine', 'ejs')
app.use(session({
    secret: app.get('secret'),
    resave: false,
    saveUninitialized: false,

}))

// custom middleware to make the sessions user available to all views

app.use((req, res, next)=>{
    res.locals.username = req.session.username
    res.locals.loggedIn = req.session.loggedIn
    next()
})

app.use((req, res, next) => {
    res.locals.message = req.session.message
    // we're setting the session message as a local var on all routes
    req.session.message = ''
    // and reset the message
    next()
})

//middleware to require authorization

const authRequired = (req, res, next) => {
    if (req.session.loggedIn) {
        next()
    } else {
        res.redirect('/session/login')
    }
}



// Setting Controllers

app.use('/items',itemsController)
app.use('/session', sessionsController)

app.get('/', (req, res)=>{
    res.redirect('/items')
})

app.get('/setcookie/:data', (req,res)=>{
    req.session.data = req.params.data
    res.send('session data sent')
})

app.get('/getSessionInfo', (req,res)=>{
    res.send(req.session.data)
})

app.listen(app.get('port'), ()=> console.log(`We're listening on port ${app.get('port')}`))


