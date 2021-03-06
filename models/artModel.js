const mongoose = require("mongoose")

const schema = mongoose.Schema({
    author: String,
    artName: String,
    chapters: [
        {
            chapterName: String,
            chapterText: String,
        }
    ],
    cardId: String
}, { collection: "arts" })

module.exports = mongoose.model("artModel", schema)