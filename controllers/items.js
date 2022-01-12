const { application } = require("express")
const express = require("express")
const router = express.Router()
const Items = require("../models/items")

//middleware to require authorization

const authRequired = (req, res, next) => {
  if (req.session.loggedIn) {
      next()
  } else {
      res.redirect('/session/login')
  }
}

const rarityChart = [
  "common",
  "uncommon",
  "rare",
  "very rare",
  "legendary",
  "artifact",
]
const priceChart = [
  [50, 100],
  [101, 500],
  [501, 5000],
  [5001, 50000],
  [50001, 100000],
  [100001, 1000000],
]



router.get("/", (req, res) => {
  Items.find({}, (err, items) => {
    res.render("index", { items })
  })
})

router.get("/new", (req, res) => {
  res.render("new")
})

// Outfit

router.get("/outfit", (req, res) => {
  res.render("outfit", { Items: Items })
})

router.get("/findshop", (req, res) => {
  res.render("findshop", { Items: Items })
})

// Shop

router.get("/shop", (req, res) => {
  Items.find({}, {}, {  }, (err, items) => {
    res.render("shop", { items, rarityChart, priceChart })
  })
})

//New Item

router.post("/", authRequired, (req, res) => {
  if (req.body.attunement === "on") {
    req.body.attunement = true
  } else {
    req.body.attunement = false
  }

  Items.create(req.body, (error, createdItem) => {
    res.redirect("/items")
  })
})

// Show

router.get("/:id", (req, res) => {
  Items.findById(req.params.id, (err, item) => {
    res.render("show", { item })
  })
})

// Edit and Update

router.put("/:id", authRequired, (req, res) => {
  if (req.body.attunement === "on") {
    req.body.attunement = true
  } else {
    req.body.attunement = false
  }
  Items.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedModel) => {
      res.redirect("/items")
    }
  )
})

router.get("/:id/edit", authRequired, (req, res) => {
  Items.findById(req.params.id, (err, foundItem) => {
    res.render("edit.ejs", {
      item: foundItem,
      id: req.params.id,
    })
  })
})

// Delete Item

router.delete("/:id",authRequired, (req, res) => {
  Items.findByIdAndRemove(req.params.id, (err, deletedItem) => {
    res.redirect("/items")
  })
})

module.exports = router
