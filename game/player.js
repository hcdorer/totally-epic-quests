const path = require(`path`)

class Player {    
    /**  
     * @param {string} playerId
     * @param {string} guildId
     * @returns {Player}
    */
    static find(playerId, guildId) {
        var players = require(path.join(__dirname, `..`, `saves`, `${guildId}_saves.json`))
        
        return players[playerId]
    }

    level = 1
    experience = 0
    expToNextLevel = 100
    currentQuest
}

module.exports = Player