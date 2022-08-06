const { strict } = require("assert")
const { captureRejectionSymbol } = require("events")
const fs = require(`fs`)
const path = require(`path`)
const GuildConfig = require("./guildConfig")

function saveData(data, filename) {
    fs.writeFile(path.join(__dirname, `..`, `saves`, filename), JSON.stringify(data), (err) => {
        if(err) {
            throw err
        }
    })
}

/**
 * @param {Logger} logger
 * @param {string} guildId
 * @param {object} players
 */
function savePlayers(logger, guildId, players) {
    let filename = `${guildId}_players.json`
    
    try {
        saveData(players, filename)
    } catch(err) {
        logger.log(`Error saving ${filename}`)
        throw err
    }

    logger.log(`Saved ${filename}`)
}

/**
 * @param {Logger} logger
 * @param {string} guildId 
 * @param {object} quests
 */
function saveQuests(logger, guildId, quests) {
    let filename = `${guildId}_quests.json`
    
    try {
        saveData(quests, filename)
    } catch(err) {
        logger.log(`Error saving ${filename}`)
        throw err
    }

    logger.log(`Saved ${filename}`)
}

/**
 * @param {Logger} logger
 * @param {string} guildId
 * @param {object} config
 */
function saveConfig(logger, guildId, config) {
    let filename = `${guildId}_config.json`

    try {
        saveData(config, filename)
    } catch(err) {
        logger.log(`Error saving ${filename}`)
        throw err
    }

    logger.log(`Saved ${filename}`)
}

/**
 * @param {Logger} logger
 * @param {string} guildId 
 * @returns {object | undefined}
 */
function loadPlayers(logger, guildId) {
    let filename = `${guildId}_players.json`
    let players

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
    let filename = `${guildId}_quests.json`
    let quests

    try {
        quests = require(path.join(__dirname, `..`, `saves`, filename))
    } catch(err) {
        logger.log(`Error loading ${filename}`)
        return
    }
    
    logger.log(`Loaded ${filename}`)
    return quests
}

/**
 * @param {Logger} logger
 * @param {string} guildId 
 * @returns {GuildConfig | undefined}
 */
function loadConfig(logger, guildId) {
    let filename = `${guildId}_config.json`
    let config

    try {
        config = require(path.join(__dirname, `..`, `saves`, filename))
    } catch(err) {
        logger.log(`Error loading ${filename}`)
        return
    }

    logger.log(`Loaded ${filename}`)
    return config
}

module.exports = {
    savePlayers,
    saveQuests,
    saveConfig,
    loadPlayers,
    loadQuests,
    loadConfig
}