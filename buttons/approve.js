const { loadConfig, loadQuests, loadPlayers, savePlayers, saveQuests, saveConfig } = require("../game/gameData.js")
const { PermissionFlagsBits } = require(`discord.js`)
const { levelUp } = require(`../game/player.js`)
const { addRankRole } = require("../game/rankRole.js")

module.exports = {
    name: `approve`,
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} pressed an "approve" button on message ${interaction.message.id}`)

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

        const players = loadPlayers(logger, interaction.guildId)
        if(!players[turnInMessage.playerId]) {
            logger.log(`There is no player with id ${turnInMessage.playerId}`)
            logger.newline
            
            delete config.turnInMessages[interaction.message.id]
            return interaction.update({content: `The player with that ID does not have a Totally Epic Quests profile!`, components: []})
        }

        const quests = loadQuests(logger, interaction.guildId)
        if(!quests[turnInMessage.questName]) {
            logger.log(`There is no quest named ${turnInMessage.questName}`)
            logger.newline()

            players[turnInMessage.playerId].currentQuest = ""
            delete config.turnInMessages[interaction.message.id]
            return interaction.update({content: `There is no quest named ${turnInMessage.questName}`, components: []})
        }

        let leveledUp = false
        players[turnInMessage.playerId].experience += quests[turnInMessage.questName].reward
        while(players[turnInMessage.playerId].experience >= players[turnInMessage.playerId].expToNextLevel) {
            levelUp(players[turnInMessage.playerId])
            leveledUp = true
        }
        
        players[turnInMessage.playerId].currentQuest = ""
        quests[turnInMessage.questName].completedBy.push(turnInMessage.playerId)
        delete config.turnInMessages[interaction.message.id]

        logger.log(`Successfully approved the turn-in request`)
        logger.log(`The player is now level ${players[turnInMessage.playerId].level} and has ${players[turnInMessage.playerId].experience} experience`)

        addRankRole(logger, players[turnInMessage.playerId], turnInMessage.playerId, config, interaction.guild)

        savePlayers(logger, interaction.guildId, players)
        saveQuests(logger, interaction.guildId, quests)
        saveConfig(logger, interaction.guildId, config)
        
        logger.newline()

        interaction.update({content: `Turn-in request approved!`, components: []})

        interaction.guild.channels.fetch(config.messageChannel)
            .then(channel => interaction.client.users.fetch(turnInMessage.playerId)
                .then(user => {
                    channel.send(`Congratulations ${user}, you have completed the ${turnInMessage.questName} quest and recieved your rewards!`)
                    if(leveledUp) {
                        channel.send(`You've also leveled up to level ${players[turnInMessage.playerId].level}!`)
                    }
                }))
    }
}