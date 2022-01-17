const { application } = require("express")
const express = require("express")
const router = express.Router()
const Items = require("../models/items")

// Function to shuffle

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }
  return array
}

//middleware to require authorization

const authRequired = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect("/session/login")
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
    res.render("index", { items, rarityChart, priceChart })
  })
})

router.get("/new", (req, res) => {
  res.render("new")
})

// Outfit

router.get("/outfit", (req, res) => {
  res.render("outfit", { Items })
})

// Shop Form: This page has two select elements, one to get limit and rarity, one to get type

router.post("/findshop/shop", (req, res) => {
  // console.log(req.body.type)
  let inventory = req.body.type
  let locale = req.body.location
  let maxRarity = req.body.rarity
  console.log(`locale is ${locale}`)
  console.log(`inventory is ${inventory}`)
  let rawInventory = []
  if (inventory === "Trader") {
    console.log('Hit Trader Route.')
  Items.find(
    {
      $or: [
        { type: "Scroll" },
        { type: "Wondrous item" },
        { type: "Weapon" },
        { type: "Armor" },
        { type: "Potion" },
      ],
      rarity: { $lte: maxRarity },
    },
    {},
    {},
    (err, items) => {
      items.forEach((item) => rawInventory.push(item))
      // This gets a limited number of items, THEN shuffles them. I need the opposite.
      let mixedInventory = shuffle(rawInventory)
      shopInventory = mixedInventory.splice(0, locale)
      //console.log(`Item number 1 is ${shopInventory[0]}`)
      res.render("shop", { items: shopInventory, rarityChart, priceChart })
    }
  )
} else {
  console.log('Hit else Route.')
  Items.find(
    { type: inventory,
      rarity: { $lte: maxRarity },
    },
    {},
    {},
    (err, items) => {
      items.forEach((item) => rawInventory.push(item))
      // This gets a limited number of items, THEN shuffles them. I need the opposite.
      let mixedInventory = shuffle(rawInventory)
      shopInventory = mixedInventory.splice(0, locale)
      console.log(`Item number 1 is ${shopInventory[0]}`)
      res.render("shop", { items: shopInventory, rarityChart, priceChart })
})}})


router.get("/findshop", (req, res) => {
  res.render("findshop", { Items: Items })
})

// Shop

router.get("/findshop/fullshop", (req, res) => {
  Items.find(
    {
      $or: [
        { type: "Scroll" },
        { type: "Wondrous item" },
        { type: "Weapon" },
        { type: "Armor" },
        { type: "Potion" },
      ],
      rarity: { $lte: 2 },
    },
    {},
    {},
    (err, items) => {
      res.render("shop", { items, rarityChart, priceChart })
    }
  )
})

//New Item

router.post("/", authRequired, (req, res) => {
  if (req.body.attunement === "on") {
    req.body.attunement = true
  } else {
    req.body.attunement = false
  }
  if (req.body.consumable === "on") {
    req.body.consumable = true
  } else {
    req.body.consumable = false
  }

  Items.create(req.body, (error, createdItem) => {
    res.redirect("/items")
  })
})

// Show

router.get("/:id", (req, res) => {
  Items.findById(req.params.id, (err, item) => {
    res.render("show", { item, rarityChart })
  })
})

// Edit and Update

router.put("/:id", authRequired, (req, res) => {
  if (req.body.attunement === "on") {
    req.body.attunement = true
  } else {
    req.body.attunement = false
  }
  if (req.body.consumable === "on") {
    req.body.consumable = true
  } else {
    req.body.consumable = false
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

router.delete("/:id", authRequired, (req, res) => {
  Items.findByIdAndRemove(req.params.id, (err, deletedItem) => {
    res.redirect("/items")
  })
})

module.exports = router
