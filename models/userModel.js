const mongoose = require("mongoose")

const schema = mongoose.Schema({
    displayName: String,
    name: {
        familyName: String,
        givenName: String
    },
    gender: String,
    username: String,
    password: String,
    cover: String,
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

schema.statics.findOneOrCreate = function findOneOrCreate(profile) {
    console.log(profile.profile.name)
    const self = this;
    return new Promise((resolve, reject) => {
        return self.findOne(profile.id)
            .then((result) => {
                if (result) {
                    return resolve(result);
                }
                return self.create({
                    displayName: profile.displayName,
                    vkontakteId: profile.id,
                    username: profile.username,
                    name: {
                        familyName: profile.profile.name.familyName,
                        givenName: profile.profile.name.givenName
                    },
                    gender: profile.gender,
                    registrationDate: new Date().getDate()
                })
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
