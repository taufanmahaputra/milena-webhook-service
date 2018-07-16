'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

require('dotenv').load()

const indexRouter = require('./routes/index')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.get('*', (req, res) => {
  res.send('Milena Webhook Service')
})

app.use('/webhook', indexRouter)

// listen on port
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
