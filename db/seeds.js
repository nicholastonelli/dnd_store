const mongoose = require("./connection.js")

const Items = require("../models/items")

const itemSeeds = require("./seeds.json")

Items.deleteMany({})
  .then(() => {
    return Items.insertMany(itemSeeds)
  })
  .then((data) => console.log(data))
  .catch((err) => console.log(err))
  .finally(() => {
    process.exit()
  })
