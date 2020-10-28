const mongoose = require('mongoose')
const artModel = require("../models/artModel")
const cardModel = require("../models/cardModel")
const cloudinary = require('cloudinary').v2
const dotenv = require("dotenv").config()

//Config для облака в котором хранится весь медиа контент
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

class artService {
    //метод создания нового произведения пользователя
    createArt = async toSave => {
        let secureUrl = ''
        //Создание ID вне модели для обмена ID между моделью карточки и произведения
        let newArtId = mongoose.Types.ObjectId()
        let newCardId = mongoose.Types.ObjectId()
        //Загрузка полученого контента в облако
        await cloudinary.uploader.upload(`./uploads/${toSave.file.filename}`, (err, result) => console.log(result, err))
            .then(async res => {
                //создание новой модели произведения
                let newArt = await new artModel({
                    author: toSave.body.author,
                    artName: toSave.body.artName,
                    cardId: newCardId,
                })
                newArt._id = newArtId
                newArt.save()
                    .catch(err => {
                        throw err
                    })
                //создание новой модели карточки произведения
                let newCard = await new cardModel({
                    coverForHotFeedUrl: res.secure_url,
                    coverForInterestingUrl: "",
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
                secureUrl = res.secure_url
                return secureUrl
            })
            //ловим ошибки
            .catch(err => {
                throw err
            })
        return {secureUrl: secureUrl}
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

