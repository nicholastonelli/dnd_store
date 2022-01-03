const { application } = require("express")
const express = require("express")
const router = express.Router()
const Items = require("../models/items")

router.get("/", (req,res) => {
    Items.find({}, (err, items)=>{
        res.render('index', { items })
    })
})

module.exports = router
