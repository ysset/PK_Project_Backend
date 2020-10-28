const mongoose = require("mongoose")

const schema = mongoose.Schema({
    cover: String,
    password: String,
    name: Number,
    screenName: String,
    vkontakteId: String,
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

schema.statics.findOneOrCreate = function findOneOrCreate(condition) {
    const self = this;
    return new Promise((resolve, reject) => {
        return self.findOne(condition)
            .then((result) => {
                if (result) {
                    return resolve(result);
                }
                return self.create(condition)
                    .then((result) => {
                        return resolve(result);
                    }).catch((error) => {
                        return reject(error);
                    })
            }).catch((error) => {
                return reject(error);
            })
    });
};

module.exports = mongoose.model("userModel", schema)
