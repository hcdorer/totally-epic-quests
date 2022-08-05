const { SlashCommandBuilder } = require(`discord.js`)
const fs = require(`fs`)
const path = require(`path`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`init`)
        .setDescription(`Initialize the bot in this server`),
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} used /init`)

        var questsFilename = `${interaction.guildId}_quests.json`
        var playersFilename = `${interaction.guildId}_players.json`

        fs.writeFile(path.join(__dirname, `..`, `saves`, questsFilename), JSON.stringify({}), (err) => {
            if(err) {
                interaction.reply(`There was a problem creating the data files!`)
                throw err
            }
        })

        fs.writeFile(path.join(__dirname, `..`, `saves`, playersFilename), JSON.stringify({}), (err) => {
            if(err) {
                interaction.reply(`There was a problem creating the data files!`)
                throw err
            }
        })

        interaction.reply(`Game initialization successful!`)
    }
}