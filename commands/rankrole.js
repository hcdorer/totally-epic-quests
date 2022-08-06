const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`)
const { loadConfig, saveConfig } = require(`../game/gameData.js`)
const RankRole = require(`../game/rankRole.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`rankrole`)
        .setDescription(`Configurate roles given to members based on their rank.  Requires Manage Server permissions.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand => subcommand
            .setName(`add`)
            .setDescription(`Add a role to the list.  Roles must be added in order from lowest rank to highest rank.`)
            .addRoleOption(option => option
                .setName(`role`)
                .setDescription(`The role to add to the list`)
                .setRequired(true))
            .addNumberOption(option => option
                .setName(`level`)
                .setDescription(`What level a member must reach before getting this role`)
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`remove`)
            .setDescription(`Remove a role from the list.`)
            .addRoleOption(option => option
                .setName(`role`)
                .setDescription(`The role to remove from the list`)
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`view`)
            .setDescription(`View the list of rank roles`)),
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} used /rankrole`)

        let config = loadConfig(logger, interaction.guildId)

        if(interaction.options.getSubcommand() === `add`) {
            logger.log(`Subcommand: add`)

            const role = interaction.options.getRole(`role`)
            const attainedAtLevel = interaction.options.getNumber(`level`)

            const rankRole = new RankRole(role.id, role.name, attainedAtLevel)

            config.rankRoles.push(rankRole)

            logger.log(`Added RankRole ${JSON.stringify(rankRole)} to the list`)
            interaction.reply({content: `Added the ${role.name} role as a rank role!`, ephemeral: true})

            saveConfig(logger, interaction.guildId, config)
        }
        if(interaction.options.getSubcommand() === `remove`) {
            logger.log(`Subcommand: remove`)

            const role = interaction.options.getRole(`role`)
            
            const rankRole = config.rankRoles.find(rankRole => rankRole.id === role.id)
            
            if(!rankRole) {
                return interaction.reply({content: `The ${role.name} role is not in the list of rank roles!`, ephemeral: true})
            }
            
            const index = config.rankRoles.indexOf(rankRole)
            config.rankRoles.splice(index, 1)

            logger.log(`Removed RankRole ${JSON.stringify(rankRole)} from the list`)
            interaction.reply({content: `Removed the ${role.name} role from the list of rank roles!`, ephemeral: true})

            saveConfig(logger, interaction.guildId, config)
        }
        if(interaction.options.getSubcommand() === `view`) {
            logger.log(`Subcommand: view`)

            if(config.rankRoles.length <= 0) {
                return interaction.reply({content: `You have not set up any rank roles for this server!`, ephemeral: true})
            }

            let output = `The rank roles for this server are:\n`

            config.rankRoles.forEach(rankRole => {
                output += `\n${rankRole.name}, attained at level ${rankRole.attainedAtLevel}`
            })

            interaction.reply({content: output, ephemeral: true})
        }
    }
}