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

module.exports = Quest