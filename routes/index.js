const line = require('@line/bot-sdk')
const express = require('express')
const router = express.Router()
const configChannel = require('../config/channel')

const mainController = require('../controller/mainController')

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
console.log(config)
const client = new line.Client(config)

router.post('/', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(event => { return mainController.handleEvent(client, event) }))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
})

module.exports = router
