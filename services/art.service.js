const mongoose = require('mongoose')
const artModel = require("../models/artModel")
const cardModel = require("../models/cardModel")

class artService {

    createArt = async toSave => {
        let newArtId = mongoose.Types.ObjectId()
        let newCardId = mongoose.Types.ObjectId()

        let newArt = await new artModel({
            author: toSave.art.author,
            artName: toSave.art.artName,
            cardId: newCardId,
        })

        newArt._id = newArtId
        newArt.save()
            .catch(err => {
                throw err
            })

        let newCard = await new cardModel({
            cover: toSave.card.cover,
            name: toSave.card.name,
            like: toSave.card.like,
            date: toSave.card.date,
            artId: newArtId
        })

        newCard._id = newCardId
        newCard.save()
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
            .then(() => {ok: true})
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
            .then(() => {ok: true})
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

