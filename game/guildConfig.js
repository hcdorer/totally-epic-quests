class GuildConfig {
    /** @type {RankRole[]} */
    rankRoles = []
    /** @type {string} */
    modChannel = ""
    /** @type {string} */
    messageChannel = ""
    /** @type {Object} */
    turnInMessages = {}
}

function convertConfig(config) {
    let newConfig = new GuildConfig()
    Object.assign(newConfig, config)
}

module.exports = { GuildConfig, convertConfig }