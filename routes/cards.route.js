const express = require("express")
const bodyParser = require("body-parser")

const CardService = require("../services/card.service")
const ArtService = require("../services/art.service")

const app = express.Router()
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const cardService = new CardService()
const artService = new ArtService()

app.get("/id/:cardId", async (req, res) => {
    let result = await cardService.findCardById(req.params.cardId)
        .catch((err) => {
            err.toString()
            res.status(err === 'Invalid input' ? 400 : 404).json({
                err: err
            })
        })
    res.send(result)
})

app.get("/interesting", async (req, res) => {
    let cards = await cardService.getInteresting()
    cards.sort((a, b) => a.like - b.like)
    res.send({interesting: cards.slice(0, 8)})
})

app.get("/hotFeed", async (req, res) => {
    let cards = await cardService.getHotFeed()
    cards
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .reverse()
        .slice(0, 12)
    res.send({hotFeed: cards.slice(0, 12)})
})

app.get('/theBestAuthors', async (req, res) => {
    let authorsCards = await cardService.getTheBestAuthors()
    res.send({theBestAuthors: authorsCards.slice(0, 8)})
})

app.get('/yourAuthors/:userId', async (req, res) => {
    let yourAuthors = await cardService.getYourAuthors(req.params.userId)
        .catch((err) => {
            err.toString()
            res.status(err === 'Invalid input' ? 400 : 404).json({
                err: err
            })
        })
    res.send(yourAuthors)
})

app.post('/saveCard', jsonParser, async (req, res) => {
    let toSave = await cardService.saveCard(req.body)
        .catch(err => {
            throw err
        })
    res.send({ok: true})
})

app.post('/createArt', jsonParser, async (req, res) => {
    let toCreate = await artService.createArt(req.body)
        .catch(err => {
            throw err
        })
    res.send({ok: true})
})

app.post('/updateArt', jsonParser, async  (req, res) => {
    let toUpdate = artService.updateArt(req.body)
        .catch(err => {
            throw err
        })
    res.send({ok: true})
})

app.get('/deleteArt', jsonParser, async (req, res) => {
    let toDelete = artService.deleteArt(req.body)
        .catch(err => {
            throw err
        })
    res.send({ok: true})
})

module.exports = app