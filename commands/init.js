const { SlashCommandBuilder } = require(`discord.js`)
const fs = require(`fs`)
const path = require(`path`)
const { savePlayers, saveQuests } = require(`../game/gameData.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`init`)
        .setDescription(`Initialize the bot in this server`),
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} used /init`)
        
        try {
            savePlayers(logger, interaction.guildId, {})
            saveQuests(logger, interaction.guildId, {})
        } catch(err) {
            return interaction.reply(`There was an error creating the files!`)
        }

        interaction.reply(`Game initialization successful!`)
    }
}