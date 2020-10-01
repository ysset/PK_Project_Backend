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
    const cards = await cardService.getInteresting()
    res.send(cards)
})

module.exports = app