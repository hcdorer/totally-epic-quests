const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`)
const { loadQuests, saveQuests } = require(`../game/gameData.js`)
const Quest = require(`../game/quest.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`quest`)
        .setDescription(`View, accept, turn in, create, edit, or delete quests.`)
        .addSubcommand(subcommand => subcommand
            .setName(`create`)
            .setDescription(`Create a new quest.`)
            .addStringOption(option => option
                .setName(`name`)
                .setDescription(`The name of the quest`)
                .setRequired(true))
            .addStringOption(option => option
                .setName(`description`)
                .setDescription(`A short description for the quest`)
                .setRequired(true))
            .addNumberOption(option => option
                .setName(`reward`)
                .setDescription(`How much experience a member recieves upon completing the quest`)
                .setRequired(true))),
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} used /quest`)

        quests = loadQuests(logger, interaction.guildId)

        if(interaction.options.getSubcommand() === `create`) {
            logger.log(`Subcommand: create`)

            if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                logger.log(`${interaction.user.tag} had insufficient permissions`)
                logger.newline()

                return interaction.reply({content: `You do not have permission to do this!`, ephemeral: true})
            }

            let name = interaction.options.getString(`name`)
            let description = interaction.options.getString(`description`)
            let reward = interaction.options.getNumber(`reward`)

            quests[name] = new Quest(description, reward)
            saveQuests(logger, interaction.guildId, quests)

            logger.log(`Added new quest "${name}": ${JSON.stringify(quests[name])}`)
            logger.newline()

            interaction.reply({content: `Quest created!`, ephemeral: true})
        }
    }
}