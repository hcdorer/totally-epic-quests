const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`)
const { loadPlayers, savePlayers, loadConfig } = require("../game/gameData")
const { levelUp } = require(`../game/player.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`award`)
        .setDescription(`Award someone a given amount of experience.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(option => option
            .setName(`member`)
            .setDescription(`The member to award experience to`)
            .setRequired(true))
        .addNumberOption(option => option
            .setName(`amount`)
            .setDescription(`The amount of experience to award`)
            .setRequired(true))
        .addStringOption(option => option
            .setName(`reason`)
            .setDescription(`The reason for awarding this experience`)),
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} used /award`)

        let user = interaction.options.getUser(`member`)
        let amount = interaction.options.getNumber(`amount`)
        let reason = interaction.options.getString(`reason`)

        let players = loadPlayers(logger, interaction.guildId)
        let config = loadConfig(logger, interaction.guildId)

        if(!players[user.id]) {
            logger.log(`${user.tag} does not have a profile`)
            logger.newline()

            return interaction.reply(`That user does not have a Totally Epic Quests profile!`)
        }

        let leveledUp = false
        players[user.id].experience += amount
        while(players[user.id].experience >= players[user.id].expToNextLevel) {
            levelUp(players[user.id])
            leveledUp = true
        }

        logger.log(`${user.tag} was given ${amount} experience for: ${reason}`)
        savePlayers(logger, interaction.guildId, players)
        logger.newline()

        interaction.reply({content: `Experience awarded!`, ephemeral: true})

        interaction.guild.channels.fetch(config.messageChannel)
            .then(channel => interaction.client.users.fetch(user.id)
                .then(user => {
                    let output = `${user}, ${interaction.user} has granted you ${amount} experience`

                    if(!reason) {
                        output += `!`
                    } else {
                        output += ` for: ${reason}!`
                    }

                    channel.send(output)
                    if(leveledUp) {
                        channel.send(`You've also leveled up to level ${players[user.id].level}!`)
                    }
                }))
    }
}