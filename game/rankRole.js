class RankRole {
    /** @type {string} */
    id
    /** @type {string} */
    name // this is really a band-aid fix, hopefully future attempts to actually fetch a role will not result in the same issues I was
         // having just now
    /** @type {number} */
    attainedAtLevel

    /**
     * @param {string} id
     * @param {string} name
     * @param {number} attainedAtLevel 
     */
    constructor(id, name, attainedAtLevel) {
        this.id = id
        this.name = name
        this.attainedAtLevel = attainedAtLevel
    }
}

module.exports = RankRole