const { loadConfig, saveConfig } = require(`../game/gameData.js`)
const PermissionFlagsBits = require(`discord.js`)

module.exports = {
    name: `deny`,
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} pressed a "deny" button on message ${interaction.message.id}`)

        if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            logger.log(`${interaction.user.tag} had insufficient permissions`)
            logger.newline()

            return interaction.reply({content: `You do not have permission to do this!`, ephemeral: true})
        }

        const config = loadConfig(logger, interaction.guildId)
        const turnInMessage = config.turnInMessages[interaction.message.id]

        if(!turnInMessage) {
            logger.log(`There was no turn in message data associated with this message`)
            logger.newline()

            return interaction.update({content: `This message did not have any associated turn-in request data!  How strange...`, components: []})
        }

        delete config.turnInMessages[interaction.message.id]

        logger.log(`Successfully denied the turn-in request`)

        saveConfig(logger, interaction.guildId, config)

        logger.newline()

        interaction.update({content: `Turn-in request denied!`, components: []})

        interaction.guild.channels.fetch(config.messageChannel)
            .then(channel => interaction.client.users.fetch(turnInMessage.playerId)
                .then(user => channel.send(`${user}, it seems that your ${turnInMessage.questName} quest isn't over yet.  Keep trying!`)))
    }
}