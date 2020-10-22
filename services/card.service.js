const cardModel = require("../models/cardModel")
const authorsCard = require("../models/authorsCardModel")
const userModel = require("../models/userModel")
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const dotenv = require("dotenv").config()

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

    createAndUpload = async toUpload => {
        let  coverUrl;
        cloudinary.config({
            cloud_name: process.env["cloud_name"],
            api_key: process.env["api_key"],
            api_secret: process.env["api_secret"],
        })
        await cloudinary.uploader.upload(`./uploads/${toUpload.file.filename}`, (err, result) => console.log(result, err))
            .then(async res => {
                await cardModel.create({coverUrl: res.secure_url}, err => {
                    if (err) throw err
                })
                return coverUrl = res.secure_url
            })
        return coverUrl
    }
}

module.exports = CardService