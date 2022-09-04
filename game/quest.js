class Quest {
    /** @type {string} */
    description
    /** @type {number} */
    reward
    /** @type {string} */
    prerequisite
    /** @type {string[]} */
    completedBy = []

    /**
     * @param {string} description 
     * @param {number} reward
     * @param {string} prerequisite
     */
    constructor(description, reward, prerequisite) {
        this.description = description
        this.reward = reward
        this.prerequisite = prerequisite
    }
}

/**
 * @param {Object} quests 
 * @returns {Object}
 */
function convertQuests(quests) {
    let newQuests = {}
    for(const name in quests) {
        newQuests = new Quest(quests[name].description, quests[name].reward, quests[name].prerequisite)
        Object.assign(newQuests[name], quests[name])
    }
}

module.exports = { Quest, convertQuests }