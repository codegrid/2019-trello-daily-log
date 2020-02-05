const utils = require('./utils')
const config = require('./config')
const boardJson = require('./data.json')

const scores = {}

utils.initScores({
  scoreModel: scores,
  allLists: boardJson.lists
})

boardJson.cards.forEach(card => {
  if (card.closed) return

  if (utils.isInClosedList(
    {
      card: card,
      allLists: boardJson.lists
    }
  )) return

  if (!utils.isInPeriod(
    {
      card: card,
      from: config.periodFrom,
      to: config.periodTo
    }
  )) return

  utils.addSocre({
    card: card,
    scoreModel: scores
  })
})

console.log(`${config.periodFrom} ~ ${config.periodTo}\n`)
console.log(utils.jsonToList(scores))
