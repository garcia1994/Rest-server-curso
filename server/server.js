require('./config/config.js')

const express = require('express')
const mongoose = require('mongoose')

const app = express()
const bodyParser = require('body-parser')

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/usuario'))

app.use(express.static(__dirname + '/public'))




mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err
    console.log(`Base de Datos corriendo en el puerto 27017`)
})
app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`)
})