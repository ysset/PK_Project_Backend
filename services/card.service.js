const Card = require("../models/cardModel")
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
        return Card.find({})
            .catch(err => {
                throw err
            })
    }
}

module.exports = CardService