const fs = require(`fs`)
const path = require(`path`)

/**
 * @param {Logger} logger
 * @param {string} guildId
 * @param {object} players
 */
function savePlayers(logger, guildId, players) {
    var filename = `${guildId}_players.json`
    
    fs.writeFile(path.join(__dirname, `..`, `saves`, filename), JSON.stringify(players), (err) => {
        if(err) {
            // logger.log(`Error saving ${filename}`)
            throw err
        }

        logger.log(`Saved ${filename}`)
    })
}

/**
 * @param {Logger} logger
 * @param {string} guildId 
 * @param {object} quests
 */
function saveQuests(logger, guildId, quests) {
    var filename = `${guildId}_quests.json`
    
    fs.writeFile(path.join(__dirname, `..`, `saves`, filename), JSON.stringify(quests), (err) => {
        if(err) {
            // logger.log(`Error saving ${filename}`)
            throw err
        }

        logger.log(`Saved ${filename}`)
    })
}

/**
 * @param {Logger} logger
 * @param {string} guildId 
 * @returns {object | undefined}
 */
function loadPlayers(logger, guildId) {
    var filename = `${guildId}_players.json`
    var players

    try {
        players = require(path.join(__dirname, `..`, `saves`, filename))
    } catch(err) {
        logger.log(`Error loading ${filename}`)
        return
    }
    
    logger.log(`Loaded ${filename}`)
    return players
}

/**
 * @param {Logger} logger
 * @param {string} guildId 
 * @returns {object | undefined}
 */
function loadQuests(logger, guildId) {
    var filename = `${guildId}_players.json`
    var quests

    try {
        quests = require(path.join(__dirname, `..`, `saves`, filename))
    } catch(err) {
        logger.log(`Error loading ${filename}`)
        return
    }
    
    logger.log(`Loaded ${filename}`)
    return quests
}

module.exports = {
    savePlayers,
    saveQuests,
    loadPlayers,
    loadQuests
}