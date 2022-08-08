const path = require(`path`)

class Player {
    /** @type {number} */
    level = 1
    /** @type {number} */
    experience = 0
    /** @type {number} */
    expToNextLevel = 100
    /** @type {string} */
    currentQuest = ""
}

module.exports = Player