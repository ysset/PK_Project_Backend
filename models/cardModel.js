const mongoose = require("mongoose")

const schema = mongoose.Schema({
    cover: String,
    name: String,
    like: Number,
    date: String,
}, { collection: 'cards' })

module.exports = mongoose.model("Card", schema)

