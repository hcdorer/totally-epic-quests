class Quest {
    /** @type {string} */
    description
    /** @type {number} */
    reward
    /** @type {string[]} */
    completedBy = []

    /**
     * @param {string} description 
     * @param {number} reward
     */
    constructor(description, reward) {
        this.description = description
        this.reward = reward
    }
}

module.exports = Quest