class RankRole {
    /** @type {string} */
    id
    /** @type {number} */
    attainedAtLevel

    /**
     * @param {string} id
     * @param {number} attainedAtLevel 
     */
    constructor(id, name, attainedAtLevel) {
        this.id = id
        this.name = name
        this.attainedAtLevel = attainedAtLevel
    }
}

module.exports = RankRole