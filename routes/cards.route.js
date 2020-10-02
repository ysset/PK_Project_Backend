const express = require("express")

const CardService = require("../services/card.service")

const app = express.Router()
const cardService = new CardService()

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
    res.send(cards.slice(0, 8))
})

app.get("/hotFeed", async (req, res) => {
    let cards = await cardService.getHotFeed()
    cards.sort((a, b) => new Date(a.date) - new Date(b.date))
    res.send(cards.slice(0, 12))
})

app.get('/theBestAuthors', async (req, res) => {
    let authorsCards = await cardService.getTheBestAuthors()
    res.send(authorsCards.slice(0, 8))
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

module.exports = app