const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/user")

const router = express.Router()

router.get("/", (req, res) => {
  res.send("Session controller works")
})

router.get("/register", (req, res) => {
  res.render("./sessions/register.ejs")
})

router.post("/register", async (req, res, next) => {
  try {
    if (req.body.password === req.body.verifyPassword) {
      // passwords must match
      const desiredUsername = req.body.username
      const userExists = await User.findOne({ username: desiredUsername })
      if (userExists) {
        req.session.message = "Username taken"
        res.redirect('/session/register')
      } else {
        // we're going to encrypt our passwords using bcrypt, so no one can access passwords
        const salt = bcrypt.genSaltSync(10)
        // Salt is extra garbage that gets thrown into encrypted passwords
        // The more salt, the more secure
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)
        // our first argument is the string we want to encrypt
        // second argument is the salt
        req.body.password = hashedPassword
        const createdUser = await User.create(req.body)
        req.session.username = createdUser.username
        // We're setting the sessions username property 
        //to be the username of the user we're logging in.
        req.session.loggedIn = true
        res.redirect('/items')
      }
      console.log(req.body)
      res.send("check your terminal")
    } else {
      req.session.message = "passwords must match"
      res.redirect('/session/register')
    }
    console.log(req.body)
    res.send("Check your terminal")
  } catch (err) {
    next(err)
  }
})

router.get("/login", (req, res) => {
  res.render("sessions/login.ejs")
})

router.post("/login", async (req, res) => {
  try {
    const userToLogin = await User.findOne({ username: req.body.username })
    if (userToLogin) {
      // res.send('user exists')
      // we need to check if passwords match
      const validPassword = bcrypt.compareSync(
        req.body.password,
        userToLogin.password
      )
      // compareSync compares the first cleartext argument to the encrypted second argument
      if (validPassword) {
        req.session.username = userToLogin.username
        req.session.loggedIn = true
        res.redirect('/items')
      } else {
        req.session.message = 'Invalid Username or Password'
        res.redirect("/session/login")
      }
    } else {
      req.session.message = "Invalid Username or Password"
    }
  } catch (err) {
    next(err)
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/session/login')
})


module.exports = router
