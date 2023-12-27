const { convertObject } = require("../utils/util-functions")

class Quest {
    /** @type {string} */
    description;
    /** @type {number} */
    reward;
    /** @type {boolean} */
    recurring;
    /** @type {string} */
    prerequisite;
    /** @type {string[]} */
    completedBy = [];

    /**
     * @param {string} description 
     * @param {number} reward
     * @param {boolean} recurring
     * @param {string} prerequisite
     */
    constructor(description, reward, recurring, prerequisite) {
        this.description = description;
        this.reward = reward;
        this.recurring = recurring;
        this.prerequisite = prerequisite;
    }
}

/**
 * @param {Object} quests 
 * @returns {Object}
 */
function convertQuests(quests) {
    let newQuests = {};
    for(const name in quests) {
        newQuests[name] = new Quest(quests[name].description, quests[name].reward, quests[name].recurring, quests[name].prerequisite);
        convertObject(quests, newQuests);
    }

    return newQuests;
}

module.exports = { Quest, convertQuests }