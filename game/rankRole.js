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

/**
 * @param {Logger} logger 
 * @param {Guild} guild 
 * @param {GuildConfig} config 
 * @param {string} playerId 
 */
function addRankRole(logger, player, playerId, config, guild) {
    for(const rankRole in config.rankRoles) {
        if(config.rankRoles[rankRole].attainedAtLevel <= player.level) {
            guild.members.fetch(playerId)
                .then(member => guild.roles.fetch(config.rankRoles[rankRole].id)
                    .then(role => {
                        if(!member.roles.cache.some(roleOnMember => roleOnMember.id === role.id)) {
                            member.roles.add(role)

                            logger.log(`Added the ${role.name} role to ${member.user.tag}`)
                            logger.newline()

                            guild.channels.fetch(config.messageChannel)
                                .then(channel => channel.send(`You earned the ${role.name} role!`))
                        }
                    }))
        }
    }
}

module.exports = { RankRole, addRankRole }