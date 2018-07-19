'use strict'
require('dotenv').load()

const express = require('express')
const mongoose = require('mongoose')
const configDb = require('./config/db')

const indexRouter = require('./routes/index')

const app = express()

mongoose.connect('mongodb://' + configDb.DB_USER + ':' + configDb.DB_PASSWORD + '@ds141631.mlab.com:41631/milena')
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Database connected')
})

app.get('*', (req, res) => {
  res.send('Milena Webhook Service')
})

app.use('/webhook', indexRouter)

// listen on port
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
