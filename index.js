const express = require("express")
const mongoose = require("mongoose")
const cardsRoute = require("./routes/cards.route")

mongoose
    .connect("mongodb+srv://Ysset:0147369852WASd@cluster0.48lsu.gcp.mongodb.net/PK_Project", { useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() =>{
        const app = express()
        app.use("/cards", cardsRoute)

        app.listen(5000, () => {
            console.log("Server is running")
        })
    })

