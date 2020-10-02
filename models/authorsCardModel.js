const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name: String,
    cover: String,
}, { collection: 'theBestAuthors' })

module.exports = mongoose.model("authorsCardModel", schema)