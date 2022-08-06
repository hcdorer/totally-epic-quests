const { SlashCommandBuilder } = require(`discord.js`)
const path = require(`path`)
const Player = require(`../game/player.js`)
const { loadPlayers, savePlayers } = require("../game/gameData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`begin`)
        .setDescription(`Create a Totally Epic Quests profile for yourself`),
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} has used /begin`)

        let players = loadPlayers(logger, interaction.guildId)

        if(players[interaction.user.id]) {
            return interaction.reply(`${interaction.member.displayName}, you have already begun Totally Epic Quests!`)
        }

        players[interaction.user.id] = new Player()
        savePlayers(logger, interaction.guildId, players)
        interaction.reply(`${interaction.member.displayName}, your Totally Epic Quests have begun!`)
    }
}