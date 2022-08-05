const path = require(`path`)

class Player {    
    /**  
     * @param {string} id
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