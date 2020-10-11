const mongoose = require("mongoose")

const schema = mongoose.Schema({
    cover: String,
    password: String,
    name: String,
    registrationDate: String,
    usersAuthors: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "userModel"
        }
    ],
    usersCards: [
        {
            type: mongoose.Schema.Types.ObjectID
        }
    ],
}, {collection: 'Users'})

module.exports = mongoose.model("userModel", schema)
