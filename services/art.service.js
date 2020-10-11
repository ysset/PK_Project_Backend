const mongoose = require('mongoose')
const artModel = require("../models/artModel")
const cardModel = require("../models/cardModel")

class artService {

    createArt = async toSave => {
        let newId = mongoose.Types.ObjectId()
        let newArt = await new artModel({
            author: toSave.art.author,
            artName: toSave.art.artName,
        })
        console.log(newArt)
        newArt._id = newId
        newArt.save()
            .catch(err => { throw err })

        let newCard = await new cardModel({
            cover: toSave.card.cover,
            name: toSave.card.name,
            like: toSave.card.like,
            date: toSave.card.date,
            artId: newId
        })
        newCard.save()
            .catch(err => { throw err })
        return {ok: true}
    }

    updateArt = async toUpdate => {
        await artModel.findOneAndUpdate(
            {_id: toUpdate.id,},
            {$push: {chapters: toUpdate.newChapters}}
            )
            .catch(err => {
                throw err
            })
        return {ok: true}
    }

    deleteArt = async toDelete => {
        artModel.findOneAndDelete({_id: toDelete.id})
    }
}

module.exports = artService

