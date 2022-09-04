class Quest {
    set description(description) {
        this.description = description
    }
    set reward(reward) {
        this.reward = reward
    }
    set prerequisite(prerequisite) {
        this.prerequisite = prerequisite
    }
    set completedBy(completedBy) {
        this.completedBy = completedBy
    }

    /**
     * @param {string} description 
     * @param {number} reward
     * @param {string} prerequisite
     */
    constructor(description, reward, prerequisite) {
        this.description = description
        this.reward = reward
        this.prerequisite = prerequisite
        this.completedBy = []
    }
}

module.exports = Quest