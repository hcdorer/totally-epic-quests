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
    constructor(description = ``, reward = 0, recurring = false, prerequisite = ``) {
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
        newQuests[name] = new Quest();
        newQuests[name] = convertObject(quests[name], newQuests[name]);
    }
    
    return newQuests;
}

module.exports = { Quest, convertQuests }