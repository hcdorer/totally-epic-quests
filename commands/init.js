const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require(`discord.js`);
const { loadConfig, createNewSave, saveExists, saveConfig } = require(`../game/gameData.js`);

function existingSaveWarning(logger, interaction, messageChannel, modChannel) {
    const config = loadConfig(interaction.guildId);
    config.resetConfig = {
        messageChannel: messageChannel,
        modChannel: modChannel
    };
    saveConfig(interaction.guildId, config, logger);

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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => option
            .setName('message-channel')
            .setDescription('The channel the bot will send messages to.')
            .setRequired(true))
        .addChannelOption(option => option
            .setName('mod-channel')
            .setDescription('The channel the bot will send moderator-specific messages to.')
            .setRequired(true)),
    async execute(logger, interaction) {
        logger.newline();
        logger.log(`${interaction.user.tag} used /init`);

        const messageChannel = interaction.options.getChannel('message-channel').id;
        const modChannel = interaction.options.getChannel('mod-channel').id;

        if(saveExists(logger, interaction.guildId)) {
            existingSaveWarning(logger, interaction);
        } else {
            try {
                createNewSave(logger, interaction.guildId, messageChannel, modChannel);

                logger.log(`Initialized Totally Epic Quests in ${interaction.guild.name} (id: ${interaction.guildId})`);
                interaction.reply(`Totally Epic Quests has been initialized in ${interaction.guild.name}!`);
            } catch(error) {
                logger.error(error);
                return interaction.reply(`Failed to initialize Totally Epic Quests!`);
            }
        }
    }
}