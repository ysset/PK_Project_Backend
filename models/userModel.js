const mongoose = require("mongoose")

const schema = mongoose.Schema({
    cover: String,
    name: String,
    registrationDate: String,
    usersAuthors: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "userModel"
        }
    ],
    usersCards: Array,
}, { collection: 'Users' })

module.exports = mongoose.model("userModel", schema)
