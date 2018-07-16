'use strict'

const express = require('express')

require('dotenv').load()

const indexRouter = require('./routes/index')

const app = express()

app.get('*', (req, res) => {
  res.send('Milena Webhook Service')
})

app.use('/webhook', indexRouter)

// listen on port
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
