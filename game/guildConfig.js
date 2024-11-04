const { convertObject } = require("../utils/util-functions")

class GuildConfig {
    /** @type {RankRole[]} */
    rankRoles = [];
    /** @type {string} */
    modChannel = "";
    /** @type {string} */
    messageChannel = "";
    /** @type {Object} */
    turnInMessages = {};
    /** @type {boolean} */
    allowSelfApprovals = true;
    /** @type {boolean} */
    showPatchNotes = true;
    /** @type {object} */
    resetConfig = null;

    constructor(messageChannel, modChannel) {
        this.messageChannel = messageChannel;
        this.modChannel = modChannel;
    }
}

/**
 * @param {Object} config 
 * @returns {GuildConfig}
 */
function convertConfig(config) {
    let newConfig = new GuildConfig();
    return convertObject(config, newConfig);
}

module.exports = { GuildConfig, convertConfig }