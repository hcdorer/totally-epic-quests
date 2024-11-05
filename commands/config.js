const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require(`discord.js`);
const { loadConfig, saveConfig } = require(`../game/gameData.js`);
const { RankRole } = require(`../game/rankRole.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`config`)
        .setDescription(`Edit the settings of the bot for this server.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommandGroup(subcommandGroup => subcommandGroup
            .setName(`rank-role`)
            .setDescription(`Configurate roles given to members based on their rank.  Requires Manage Server permissions.`)
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
                .setDescription(`View the list of rank roles`)))
        .addSubcommand(subcommand => subcommand
            .setName(`set-message-channel`)
            .setDescription(`Set the channel the bot will send messages to.`)
            .addChannelOption(option => option
                .setName(`channel`)
                .setDescription(`The channel the bot will send messages to.`)
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`set-mod-channel`)
            .setDescription(`Set the channel the bot will send moderator-specific messages to.`)
            .addChannelOption(option => option
                .setName(`channel`)
                .setDescription(`The channel the bot will send moderator-specific messages to.`)
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('set-quest-author-role')
            .setDescription('Allow users with a given role to create and edit quests.')
            .addRoleOption(option => option
                .setName('quest-author-role')
                .setDescription('The quest author role.  If left blank, only server moderators will have this ability.')))
        .addSubcommand(subcommand => subcommand
            .setName('allow-self-approvals')
            .setDescription('Set whether or not moderators are allowed to approve their own quest turn-in requests.')
            .addBooleanOption(option => option
                .setName('value')
                .setDescription('True to allow this, false to disallow.')
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('show-patch-notes')
            .setDescription("Set whether or not patch notes are broadcasted in the server's message channel.")
            .addBooleanOption(option => option
                .setName('value')
                .setDescription("True to show patch notes, false to disallow.")
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`view`)
            .setDescription(`Show the config settings for this server.`)),
    async execute(logger, interaction) {
        logger.newline();
        logger.log(`${interaction.user.tag} used /config`);

        let config = loadConfig(interaction.guildId, logger);

        if(interaction.options.getSubcommandGroup() === `rank-role`) {
            logger.log(`Subcommand group: rank-role`);

            if(interaction.options.getSubcommand() === `add`) {
                logger.log(`Subcommand: add`);

                const role = interaction.options.getRole(`role`);
                const attainedAtLevel = interaction.options.getNumber(`level`);

                const rankRole = new RankRole(role.id, attainedAtLevel);

                config.rankRoles.push(rankRole);
                saveConfig(interaction.guildId, config, logger);
                
                logger.log(`Added RankRole ${JSON.stringify(rankRole)} to the RankRole list`);
                interaction.reply({content: `Added the ${role.name} role as a rank role!`, ephemeral: true});

                return;
            }
            if(interaction.options.getSubcommand() === `remove`) {
                logger.log(`Subcommand: remove`);

                const role = interaction.options.getRole(`role`);
                
                const rankRole = config.rankRoles.find(rankRole => rankRole.id === role.id);
                
                if(!rankRole) {
                    return interaction.reply({content: `The ${role.name} role is not in the list of rank roles!`, ephemeral: true});
                }
                
                const index = config.rankRoles.indexOf(rankRole);
                config.rankRoles.splice(index, 1);
                saveConfig(interaction.guildId, config, logger);

                logger.log(`Removed RankRole ${JSON.stringify(rankRole)} from the RankRole list`);
                interaction.reply({content: `Removed the ${role.name} role from the list of rank roles!`, ephemeral: true});
                
                return;
            }
            if(interaction.options.getSubcommand() === `view`) {
                logger.log(`Subcommand: view`);

                if(config.rankRoles.length <= 0) {
                    return interaction.reply({content: `You have not set up any rank roles for this server!`, ephemeral: true});
                }

                let buildEmbed = () => {                   
                    // eslint-disable-next-line no-unused-vars
                    return new Promise((resolve, reject) => {
                        logger.log(`Building embed`);

                        const embed = new EmbedBuilder()
                            .setTitle(`${interaction.guild.name} Rank Roles`)
                            .setColor(0x39e75f);

                        config.rankRoles.forEach(rankRole => {
                            interaction.guild.roles.fetch(rankRole.id)
                                .then(role => {
                                    embed.addFields({name: `${role.name}`, value: `Attained at level ${rankRole.attainedAtLevel}`});
                                });
                        });

                        resolve(embed);
                    });
                };

                buildEmbed().then(embed => interaction.reply({embeds: [embed], ephemeral: true}));

                return;
            }
        }
        if(interaction.options.getSubcommand() === `set-message-channel`) {
            logger.log(`Subcommand: set-message-channel`);

            let channel = interaction.options.getChannel(`channel`);
            
            config.messageChannel = channel.id;
            saveConfig(interaction.guildId, config, logger);

            logger.log(`Message channel set to #${channel.name} (id: ${channel.id})`);
            interaction.reply({content: `Set message channel to <#${channel.id}>!`, ephemeral: true});

            return;
        }
        if(interaction.options.getSubcommand() === `set-mod-channel`) {
            logger.log(`Subcommand: set-mod-channel`);

            let channel = interaction.options.getChannel(`channel`);
            
            config.modChannel = channel.id;
            saveConfig(interaction.guildId, config, logger);

            logger.log(`Mod channel set to #${channel.name} (id: ${channel.id})`);
            interaction.reply({content: `Set mod channel to <#${channel.id}>!`, ephemeral: true});

            return;
        }
        if(interaction.options.getSubcommand() === 'set-quest-author-role') {
            logger.log('Subcommand: set-quest-author-role');

            let role = interaction.options.getRole('quest-author-role');

            if(role) {
                config.questAuthorRole = role.id;
            } else {
                config.questAuthorRole = "";
            }
            saveConfig(interaction.guildId, config, logger);

            logger.log(`${config.questAuthorRole ? `Quest author role set to role with ID ${config.questAuthorRole}` : 'Quest author role removed.'}`);
            interaction.reply({ content: `${config.questAuthorRole ? `Set quest author role to <@&${config.questAuthorRole}>.` : `Quest author role removed.`}`, ephemeral: true });

            return;
        }
        if(interaction.options.getSubcommand() === 'allow-self-approvals') {
            logger.log('Subcommand: allow-self-approvals');

            let value = interaction.options.getBoolean('value');

            config.allowSelfApprovals = value;
            saveConfig(interaction.guildId, config, logger);

            logger.log(`allowSelfApprovals set to ${value}`);
            interaction.reply({ content: `${config.allowSelfApprovals ? 'Server mods are now allowed to approve their own turn-in requests.' : 'Server mods are no longer allowed to approve their own turn-in requests.'}`, ephemeral: true });

            return;
        }
        if(interaction.options.getSubcommand() === 'show-patch-notes') {
            logger.log("Subcommand: show-patch-notes");

            let value = interaction.options.getBoolean('value');

            config.showPatchNotes = value;
            saveConfig(interaction.guildId, config, logger);

            logger.log(`showPatchNotes set to ${value}`);
            interaction.reply({ content: `${config.showPatchNotes ? `Totally Epic Quests patch notes will be shown in <#${config.messageChannel}>` : `Totally Epic Quests patch notes will not be shown in <#${config.messageChannel}>`}`, ephemeral: true });

            return;
        }
        if(interaction.options.getSubcommand() === `view`) {
            if(interaction.options.getSubcommandGroup() === `rank-role`) {
                return;
            }

            logger.log(`Subcommand: view`);
            
            const output = new EmbedBuilder()
                .setTitle(`${interaction.guild.name} Config`)
                .setColor(0x39e75f)
                .addFields(
                    { name: `Message Channel`, value: config.messageChannel ? `<#${config.messageChannel}>` : `None` },
                    { name: `Mod Channel`, value: config.modChannel ? `<#${config.modChannel}>` : `None` },
                    { name: 'Quest Author Role', value: config.questAuthorRole ? `<@&${config.questAuthorRole}>` : 'None' },
                    { name: 'Allow Self Approvals', value: `${config.allowSelfApprovals}` },
                    { name: 'Show Patch Notes', value: `${config.showPatchNotes}` }
                );
            
            logger.log(`Displaying this server's config`);
            interaction.reply({embeds: [output], ephemeral: true});

            return;
        }
    }
}