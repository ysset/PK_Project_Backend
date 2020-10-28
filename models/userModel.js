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
    hatProfileCover: String,
    vkontakteId: String,
    registrationDate: String,
    // "https://res-console.cloudinary.com/dbhjalp68/thumbnails/v1/image/upload/v1603372282/YmdndHRlcHR6cWptdmtsNHdqMWs=/preview"
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
    const self = this;
    return new Promise((resolve, reject) => {
        return self.findOne({vkontakteId: profile.id})
            .then((result) => {
                if (result) {
                    return resolve(result);
                }
                return self.create({
                    displayName: profile.displayName,
                    vkontakteId: profile.id,
                    username: profile.username,
                    name: {
                        familyName: profile.name.familyName,
                        givenName: profile.name.givenName
                    },
                    gender: profile.gender,
                    registrationDate: `${new Date().getDay()}:${new Date().getMonth()}:${new Date().getFullYear()},${new Date().getHours()}:${new Date().getMinutes()}`
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
