const mongoose = require('mongoose')
const artModel = require("../models/artModel")
const cardModel = require("../models/cardModel")
const cloudinary = require('cloudinary').v2
const dotenv = require("dotenv").config()

class artService {

    createArt = async toSave => {
        let newArtId = mongoose.Types.ObjectId()
        let newCardId = mongoose.Types.ObjectId()

        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        })

        await cloudinary.uploader.upload(`./uploads/${toSave.file.filename}`, (err, result) => console.log(result, err))
            .then(async res => {
                let newArt = await new artModel({
                    author: toSave.body.author,
                    artName: toSave.body.artName,
                    cardId: newCardId,
                })
                console.log(res)
                newArt._id = newArtId
                newArt.save()
                    .catch(err => {
                        throw err
                    })
                let newCard = await new cardModel({
                    coverUrl: res.secure_url,
                    name: toSave.body.artName,
                    like: toSave.body.like,
                    date: toSave.body.date,
                    artId: newArtId,
                })
                newCard._id = newCardId
                newCard.save()
                    .catch(err => {
                        throw err
                    })
            })
            .catch(err => {
                throw err
            })
        return {ok: true}
    }

    updateArt = async toUpdate => {
        if (!mongoose.Types.ObjectId.isValid(toUpdate.id)) throw "Invalid input"
        await artModel.findOneAndUpdate(
            {_id: toUpdate.id},
            {$push: {chapters: toUpdate.newChapters}}
        )
            .then(() => {
                ok: true
            })
            .catch(err => {
                throw err
            })
    }

    updateArtName = async toUpdate => {
        if (!mongoose.Types.ObjectId.isValid(toUpdate.id)) throw "Invalid input"
        await artModel.findByIdAndUpdate(
            {_id: toUpdate.id},
            {artName: toUpdate.newArtName}
        )
            .then(() => {
                ok: true
            })
            .catch(err => {
                throw err
            })
    }

    deleteChapterOfArt = async toDelete => {
        if (!mongoose.Types.ObjectId.isValid(toDelete.id)) throw "Invalid input"
        let data = await artModel.findById({_id: toDelete.id})

        const filteredData = data.chapters.filter((item) => {
            console.log(toDelete.chaptersId)
            return item._id.toString() !== toDelete.chaptersId.toString()
        });
        console.log(filteredData)

        await artModel.findOneAndUpdate(
            {_id: toDelete.id},
            {chapters: filteredData},
            err => {
                if (err) throw err
            }
        )
    }

    deleteArt = async toDelete => {
        if (!mongoose.Types.ObjectId.isValid(toDelete.artId) ||
            !mongoose.Types.ObjectId.isValid(toDelete.cardId)) throw "Invalid input"
        artModel.findByIdAndDelete({_id: toDelete.artId}, err => {
            if (err) throw err
        })
        cardModel.findByIdAndDelete({_id: toDelete.cardId}, err => {
            if (err) throw err
        })
    }

}

module.exports = artService

