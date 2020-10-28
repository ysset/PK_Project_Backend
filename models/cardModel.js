const mongoose = require("mongoose")

const schema = mongoose.Schema({
    coverUrl: String,
    name: String,
    like: Number,
    date: String,
    artId: mongoose.Schema.Types.ObjectID
}, { collection: 'cards' })

module.exports = mongoose.model("Card", schema)

