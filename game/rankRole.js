class RankRole {
    /** @type {string} */
    id
    /** @type {number} */
    attainedAtLevel

    /**
     * @param {string} id
     * @param {number} attainedAtLevel 
     */
    constructor(id, attainedAtLevel) {
        this.id = id
        this.attainedAtLevel = attainedAtLevel
    }
}

module.exports = RankRole