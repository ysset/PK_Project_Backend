const cardModel = require("../models/cardModel")
const authorsCard = require("../models/authorsCardModel")
const userModel = require("../models/userModel")
const mongoose = require('mongoose')

class CardService {

    findCardById(idToFind) {

        return new Promise(async (resolve, reject) => {
            if (!mongoose.Types.ObjectId.isValid(idToFind)) {
                return reject('Invalid input')
            }
            let result = await cardModel.find({_id: idToFind})
            if (result.length === 0) {
                reject('Id not found')
            }
            resolve(result)
        })
    }

    getInteresting() {
        return cardModel
            .find({})
            .catch(err => {
                throw err
            })
    }

    getHotFeed() {
        return cardModel.find({})
            .catch(err => {
                throw err
            })
    }

    getTheBestAuthors() {
        return authorsCard.find({})
            .catch(err => {
                throw err
            })
    }

    getYourAuthors(userId) {
        return new Promise(async (resolve, reject) => {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return reject('Invalid input')
            }
            let result = await userModel
                .findById(userId)
                .populate("usersAuthors")
            if (result === null) reject("You don't have lovely authors, yet =)")

            //нечаянно реализовал метод 1:М в коде.

            // let yourAuthors = new Promise(async (resolve, reject) => {
            //     result.map(async (object) => {
            //         let findYourAuthors = await userModel.find({_id: [...object.usersAuthors]})
            //         if (findYourAuthors.length === 0) reject("You don't have lovely authors, yet =)")
            //         resolve(findYourAuthors)
            //     })
            // })
            resolve(result.usersAuthors)
        })
    }

    saveCard = async toSave => {
        if (!mongoose.Types.ObjectId.isValid(toSave.yourId) || !mongoose.Types.ObjectId.isValid(toSave.cardId)) throw "Invalid input"
        await userModel.findOneAndUpdate(
            { _id: toSave.yourId },
            { $push: {usersCards: toSave.cardId} },
            )
            .catch(err => {
                throw err
            })
        return {ok: true}
    }

}

module.exports = CardService