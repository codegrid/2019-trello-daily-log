const moment = require('moment')
const config = require('./config')

// plugin ID of story point in trello
const PLUGIN_ID_OF_STORYPOINT = '59d4ef8cfea15a55b0086614'

module.exports = {

  // prepare score object

  initScores ({ scoreModel, allLists }) {
    this.getMemberNames({
      allLists: allLists,
      listNamesToExclude: config.list_to_exclude
    }).forEach(name => {
      scoreModel[name] = 0
    })
  },

  // pick member names from lists

  getMemberNames ({ allLists, listNamesToExclude }) {
    const memberNames = []

    allLists.forEach(list => {
      if (list.closed) return
      if (listNamesToExclude.includes(list.name)) return
      memberNames.push(list.name)
    })

    return memberNames
  },

  // the card's list is closed or not

  isInClosedList ({ card, allLists }) {
    const listId = card.idList
    let isClosed = false

    allLists.forEach(list => {
      if (isClosed) return
      if (list.id === listId && list.closed) {
        isClosed = true
      }
    })

    return isClosed
  },

  // the card's date is between from and to or not

  isInPeriod ({ card, from, to }) {
    const dateFormat = 'YYYY/MM/DD'
    const strArray = card.name.split(' ')

    if (!strArray.length) return null

    const cardMoment = moment(`2020/${strArray[0]}`, dateFormat)
    const periodFrom = moment(`2020/${from}`, dateFormat)
    const periodTo = moment(`2020/${to}`, dateFormat)

    if (!cardMoment.isSameOrAfter(periodFrom)) return false
    if (!cardMoment.isSameOrBefore(periodTo)) return false

    return true
  },

  // add the card's point to scoreModel

  addSocre ({ card, scoreModel }) {
    Object.keys(scoreModel).forEach(name => {
      if (card.name.indexOf(name) === -1) return
      const score = this.getStoryPoint(card)
      scoreModel[name] += score
    })
  },

  // get story point data from the card

  getStoryPoint (card) {
    if (!Array.isArray(card.pluginData)) return null

    let result

    card.pluginData.forEach(item => {
      if (item.idPlugin !== PLUGIN_ID_OF_STORYPOINT) return

      const value = JSON.parse(item.value)
      result = value.points
    })

    return result
  },

  // convert to list

  jsonToList (scoreModel) {
    let result = ''
    Object.keys(scoreModel).forEach(key => {
      result += `${key}: ${scoreModel[key]}\n`
    })
    return result
  }

}
