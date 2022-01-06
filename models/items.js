const mongoose = require("../db/connection")

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rarity: { type: Number, required: true, min: 0, max: 5 },
  image: { type: String },
  attunement: { type: Boolean, required: true, default: false },
  type: { type: String, required: true, default: "adventuring gear" },
  subtype: { type: String },
  slot: { type: String },
  description: { type: String, required: true },
  rules: { type: String },
  source: { type: String, required: true, default: "homebrew" },
  setting: { type: String, required: true, default: "universal" },
})

const Items = mongoose.model("Items", itemSchema)

module.exports = Items
