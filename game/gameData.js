const fs = require(`fs`);
const path = require(`path`);
const { GuildConfig } = require(`./guildConfig.js`);

function saveData(data, filename) {
    fs.writeFile(path.join(__dirname, `..`, `saves`, filename), JSON.stringify(data), (err) => {
        if(err) {
            throw err;
        }
    });
}

/**
 * @param {string} guildId
 * @param {object} players
 * @param {Logger} logger
 */
function savePlayers(guildId, players, logger = null) {
    let filename = `${guildId}_players.json`;
    
    try {
        saveData(players, filename);
    } catch(err) {
        if(logger) {
            logger.log(`Error saving ${filename}`);
        }

        throw err;
    }

    if(logger) {
        logger.log(`Saved ${filename}`);
    }
}

/**
 * @param {string} guildId 
 * @param {object} quests
 * @param {Logger} logger
 */
function saveQuests(guildId, quests, logger = null) {
    let filename = `${guildId}_quests.json`;
    
    try {
        saveData(quests, filename);
    } catch(err) {
        if(logger) {
            logger.log(`Error saving ${filename}`);
        }

        throw err;
    }

    if(logger) {
        logger.log(`Saved ${filename}`);
    }
}

/**
 * @param {string} guildId
 * @param {object} config
 * @param {Logger} logger
 */
function saveConfig(guildId, config, logger = null) {
    let filename = `${guildId}_config.json`;

    try {
        saveData(config, filename);
    } catch(err) {
        if(logger) {
            logger.log(`Error saving ${filename}`);
        }

        throw err;
    }

    if(logger) {
        logger.log(`Saved ${filename}`);
    }
}

/**
 * @param {string} guildId
 * @param {Logger} logger
 * @returns {object | undefined}
 */
function loadPlayers(guildId, logger = null) {
    let filename = `${guildId}_players.json`;
    let players;

    try {
        players = require(path.join(__dirname, `..`, `saves`, filename));
    } catch(err) {
        if(logger) {
            logger.log(`Error loading ${filename}`);
        }
        return null;
    }
    
    if(logger) {
        logger.log(`Loaded ${filename}`);
    }

    return players;
}

/**
 * @param {string} guildId
 * @param {Logger} logger
 * @returns {object | undefined}
 */
function loadQuests(guildId, logger = null) {
    let filename = `${guildId}_quests.json`;
    let quests;

    try {
        quests = require(path.join(__dirname, `..`, `saves`, filename));
    } catch(err) {
        if(logger) {
            logger.log(`Error loading ${filename}`);
        }

        return null;
    }
    
    if(logger) {
        logger.log(`Loaded ${filename}`);
    }

    return quests;
}

/**
 * @param {string} guildId
 * @param {Logger} logger 
 * @returns {GuildConfig | undefined}
 */
function loadConfig(guildId, logger = null) {
    let filename = `${guildId}_config.json`;
    let config;

    try {
        config = require(path.join(__dirname, `..`, `saves`, filename));
    } catch(err) {
        if(logger) {
            logger.log(`Error loading ${filename}`);
        }

        return null;
    }

    if(logger) {
        logger.log(`Loaded ${filename}`);
    }

    return config;
}

/**
 * 
 * @param {Logger} logger 
 * @param {any} interaction 
 * @returns 
 */
function createNewSave(logger, guildId, messageChannel, modChannel) {
    logger.log(`Attempting to create a new save in the server with id ${guildId})`);
    
    savePlayers(guildId, {}, logger);
    saveQuests(guildId, {}, logger);
    saveConfig(guildId, new GuildConfig(messageChannel, modChannel), logger);
}

function saveExists(logger, guildId) {
    logger.log(`Checking if a save exists for the server with id ${guildId}`);

    return loadPlayers(guildId, logger) && loadQuests(guildId, logger) && loadConfig(guildId, logger); // what happens if one of those files goes missing?
}

module.exports = {
    savePlayers,
    saveQuests,
    saveConfig,
    loadPlayers,
    loadQuests,
    loadConfig,
    createNewSave,
    saveExists
}