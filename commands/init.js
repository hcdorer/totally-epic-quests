const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`)
const fs = require(`fs`)
const path = require(`path`)
const { savePlayers, saveQuests, saveConfig } = require(`../game/gameData.js`)
const GuildConfig = require(`../game/guildConfig.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`init`)
        .setDescription(`Initialize the bot in this server.  Requires Manage Server permission.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} used /init`)
        
        try {
            savePlayers(logger, interaction.guildId, {})
            saveQuests(logger, interaction.guildId, {})
            saveConfig(logger, interaction.guildId, new GuildConfig())
        } catch(err) {
            console.error(err)
            return interaction.reply(`Failed to initialize Totally Epic Quests!`)
        }

        interaction.reply(`Totally Epic Quests has been initialized in this server!`)

        logger.log(`Initialized Totally Epic Quests in ${interaction.guild.name} (id: ${interaction.guildId})`)
    }
}