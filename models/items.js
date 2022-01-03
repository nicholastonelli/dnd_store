const mongoose = require('../db/connection')

const itemSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    rarity: { type: Number, required: true},
    image:  { type: String},
    attunement: {type: Boolean, required: true, default: false},
    type: {type: String, required: true, default: 'adventuring gear'},
    description: {type: String, required: true},
    setting: {type: String, required: true, default: 'universal'}
})

const Items = mongoose.model('Items', itemSchema);

module.exports = Items