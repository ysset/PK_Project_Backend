const Card = require("../models/cardModel")
const authorsCard = require("../models/authorsCardModel")
const userModel = require("../models/userModel")
const mongoose = require('mongoose')

class CardService {

    findCardById(idToFind) {

        return new Promise(async (resolve, reject) => {
            if (!mongoose.Types.ObjectId.isValid(idToFind)) {
                return reject('Invalid input')
            }
            let result = await Card.find({_id: idToFind})
            if (result.length === 0) {
                reject('Id not found')
            }
            resolve(result)
        })
    }

    getInteresting() {
        return Card
            .find({})
            .catch(err => {
                throw err
            })
    }

    getHotFeed() {
        return Card.find({})
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
}

module.exports = CardService