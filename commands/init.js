const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require(`discord.js`);
const { loadPlayers, loadQuests, loadConfig } = require(`../game/gameData.js`);
const { createNewSave } = require(`../utils/util-functions.js`);

function existingSaveWarning(logger, interaction) {
    let description = `Totally Epic Quests has already been initialized in ${interaction.guild.name}!`;
    description += `\nRunning /init again will overwrite **all** existing saves and completely reset **all** progress.`;
    description += `\nAre you sure you want to continue?`

    const embed = new EmbedBuilder()
        .setTitle(`⚠ WARNING ⚠`)
        .setColor(0x39e75f)
        .setDescription(description);
    
    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`reset`)
                .setLabel(`Yes`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`dontReset`)
                .setLabel(`No`)
                .setStyle(ButtonStyle.Danger)
        );
    
    interaction.reply({embeds: [embed], components: [buttons], ephemeral: true});
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`init`)
        .setDescription(`Initialize the bot in this server.  Requires Manage Server permission.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(logger, interaction) {
        logger.newline();
        logger.log(`${interaction.user.tag} used /init`);

        if(loadPlayers(interaction.guildId, logger) && loadQuests(interaction.guildId, logger) && loadConfig(interaction.guildId, logger)) {
            existingSaveWarning(logger, interaction);
        } else {
            try {
                createNewSave(logger, interaction);

                logger.log(`Initialized Totally Epic Quests in ${interaction.guild.name} (id: ${interaction.guildId})`);
                interaction.reply(`Totally Epic Quests has been initialized in ${interaction.guild.name}!`);
            } catch(error) {
                console.error(error);
                return interaction.reply(`Failed to initialize Totally Epic Quests!`);
            }
        }
    }
}