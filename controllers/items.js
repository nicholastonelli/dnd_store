const { application } = require("express")
const express = require("express")
const router = express.Router()
const Items = require("../models/items")

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

// Shop

router.get("/shop", (req, res) => {
  Items.find({}, (err, items) => {
    res.render("shop", { items, rarityChart, priceChart })
  })
})

//New Item

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.get("/:id/edit", (req, res) => {
  Items.findById(req.params.id, (err, foundItem) => {
    res.render("edit.ejs", {
      item: foundItem,
      id: req.params.id,
    })
  })
})

// Delete Item

router.delete("/:id", (req, res) => {
  Items.findByIdAndRemove(req.params.id, (err, deletedItem) => {
    res.redirect("/items")
  })
})

module.exports = router
