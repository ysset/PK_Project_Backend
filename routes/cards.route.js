const express = require("express")
const bodyParser = require("body-parser")

const CardService = require("../services/card.service")
const ArtService = require("../services/art.service")
const multer = require("multer")

const upload = multer({ dest: 'uploads/'})
const app = express.Router()
const jsonParser = bodyParser.json()
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
        .then(() => res.send(yourAuthors))
        .catch((err) => {
            err.toString()
            res.status(err === 'Invalid input' ? 400 : 404).json({
                err: err
            })
        })

})

app.post('/saveCard', jsonParser, async (req, res) => {
    await cardService.saveCard(req.body)
        .then(() => res.send({ok: true}))
        .catch(err => {
            err.toString()
            res.status(err === 'Invalid input' ? 400 : 404).json({
                err: err
            })
        })
})

app.post('/createArt', upload.single('cover'), async (req, res) => {
    console.log(req.body)
    await artService.createArt(req)
        .then(() => res.send({ok: true}))
        .catch(err => {
            err.toString()
            res.status(err === 'Invalid input' ? 400 : 404).json({
                err: err
            })
        })
})

app.post('/updateArt', jsonParser, async  (req, res) => {
    await artService.updateArt(req.body)
        .then(() => res.send({ok: true}))
        .catch(err => {
            err.toString()
            res.status(err === 'Invalid input' ? 400 : 404).json({
                err: err
            })
        })

})

app.post('/deleteArt', jsonParser, async (req, res) => {
    await artService.deleteArt(req.body)
        .then((isOk) => res.send(isOk))
        .catch(err => {
            err.toString()
            res.status(err === 'Invalid input' ? 400 : 404).json({
                err: err
            })
        })
})

app.post('/deleteChapterOfArt', jsonParser, async (req, res) => {
    await artService.deleteChapterOfArt(req.body)
        .then(() => res.send({ok: true}))
        .catch(err => {
            err.toString()
            res.status(err === 'Invalid input' ? 400 : 404).json({
                err: err
            })
        })
})

app.post('/createAndUpload', upload.single('cover'), async (req, res) => {
    await artService.createArt(req)
        .then(coverUrl => res.json(coverUrl))
})

module.exports = app