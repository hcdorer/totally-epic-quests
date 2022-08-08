const { loadConfig, loadQuests, loadPlayers, savePlayers, saveQuests, saveConfig } = require("../game/gameData")

module.exports = {
    name: `approve`,
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} pressed an "approve" button on message ${interaction.message.id}`)

        const config = loadConfig(logger, interaction.guildId)
        const turnInMessage = config.turnInMessages[interaction.message.id]

        if(!turnInMessage) {
            logger.log(`There was no turn in message data associated with this message`)
            logger.newline()

            return interaction.update({content: `This message did not have any associated turn-in request data!  How strange...`, components: []})
        }

        const quests = loadQuests(logger, interaction.guildId)
        if(!quests[turnInMessage.questName]) {
            logger.log(`There is no quest named ${turnInMessage.questName}`)
            logger.newline()

            return interaction.update({content: `There is no quest named ${turnInMessage.questName}`, components: []})
        }

        const players = loadPlayers(logger, interaction.guildId)
        if(!players[turnInMessage.playerId]) {
            logger.log(`There is no player with id ${turnInMessage.playerId}`)
            logger.newline
            
            return interaction.update({content: `The player with that ID does not have a Totally Epic Quests profile!`, components: []})
        }

        players[turnInMessage.playerId].experience += quests[turnInMessage.questName].reward
        players[turnInMessage.playerId].currentQuest = ""
        quests[turnInMessage.questName].completedBy.push(turnInMessage.playerId)
        delete config.turnInMessages[interaction.message.id]

        logger.log(`Successfully approved the turn-in request`)

        savePlayers(logger, interaction.guildId, players)
        saveQuests(logger, interaction.guildId, quests)
        saveConfig(logger, interaction.guildId, config)
        
        logger.newline()

        interaction.update({content: `Turn-in request approved!`, components: []})

        interaction.guild.channels.fetch(config.messageChannel)
            .then(channel => interaction.client.users.fetch(turnInMessage.playerId)
                .then(user => channel.send(`Congratulations ${user}, you have completed the ${turnInMessage.questName} quest and recieved your rewards!`)))
    }
}