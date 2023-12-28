const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require(`discord.js`);
const { loadQuests, saveQuests, loadPlayers, loadConfig, saveConfig } = require(`../game/gameData.js`);
const { Quest } = require(`../game/quest.js`);
const TurnInMessage = require("../game/turnInMessage.js");
const { permissionCheck } = require("../utils/util-functions.js");

function createQuest(logger, interaction, quests) {
    const name = interaction.options.getString(`name`);
    const description = interaction.options.getString(`description`);
    const reward = interaction.options.getNumber(`reward`);
    const recurring = interaction.options.getBoolean(`recurring`);
    const prerequisiteName = interaction.options.getString(`prerequisite`);
    
    let prerequisite = "";
    if(prerequisiteName) {
        if(!quests[prerequisiteName]) {
            logger.log(`The quest "${prerequisiteName}" does not exist, so it cannot be a prerequisite`);
            return interaction.reply({content: `There is no quest called "${prerequisiteName}", so it cannot be a prerequisite!`, ephemeral: true});
        }

        prerequisite = prerequisiteName;
    }
    
    if(quests[name]) {
        logger.log(`A quest named ${name} already exists`);
        return interaction.reply({content: `That quest already exists!`, ephemeral: true});
    }

    quests[name] = new Quest(description, reward, recurring ? recurring : false, prerequisite);
    logger.log(`Added new quest "${name}": ${JSON.stringify(quests[name])}`);

    saveQuests(interaction.guildId, quests, logger);

    interaction.reply({content: `${name} quest created!`, ephemeral: true});
}

function deleteQuest(logger, interaction, quests) {
    let name = interaction.options.getString(`name`);

    if(!quests[name]) {
        logger.log(`No quest named ${name} exists`);
        return interaction.reply({content: `There's no quest named ${name}!`, ephemeral: true});
    }

    delete quests[name]
    saveQuests(interaction.guildId, quests, logger);

    logger.log(`Deleted the "${name}" quest`);

    interaction.reply({content: `Quest deleted!`, ephemeral: true});
}

function editQuest(logger, interaction, quests) {
    const name = interaction.options.getString(`name`);
    const newName = interaction.options.getString(`new-name`);
    const description = interaction.options.getString(`description`);
    const reward = interaction.options.getNumber(`reward`);
    const recurring = interaction.options.getBoolean(`recurring`);
    const prerequisiteName = interaction.options.getString(`prerequisite`);

    if(!quests[name]) {
        logger.log(`No quest named ${name} exists`);
        return interaction.reply({content: `There's no quest named ${name}!`, ephemeral: true});
    }

    let newDescription = quests[name].description;
    if(description) {
        newDescription = description;
    }

    let newReward = quests[name].reward;
    if(reward) {
        newReward = reward;
    }

    let newRecurring = quests[name].recurring;
    if(recurring) {
        newRecurring = recurring;
    }

    let newPrerequisite = quests[name].prerequisite;
    if(prerequisiteName) {
        if(!quests[prerequisiteName]) {
            logger.log(`The quest ${prerequisiteName} does not exist, so it cannot be a prerequisite`);
            return interaction.reply({content: `There is no quest called ${prerequisiteName}, so it cannot be a prerequisite!`, ephemeral: true});
        }
        
        newPrerequisite = prerequisiteName;
    }

    const newCompletedBy = quests[name].completedBy;

    if(newName) {
        quests[newName] = new Quest(newDescription, newReward, newRecurring, newPrerequisite);
        quests[newName].completedBy = newCompletedBy;
        delete quests[name];
        
        logger.log(`The ${name} quest is now ${newName}: ${JSON.stringify(quests[newName])}`);
    } else {
        quests[name] = new Quest(newDescription, newReward, newPrerequisite);
        quests[name].completedBy = newCompletedBy;
        
        logger.log(`The "${name}" quest is now: ${JSON.stringify(quests[name])}`);
    }

    saveQuests(interaction.guildId, quests, logger);

    interaction.reply({content: `${name} quest edited!`, ephemeral: true});
}

function listQuests(interaction, quests) {
    let buildQuestList = () => {
        let valueOutput = ``;
        for(const name in quests) {
            valueOutput += `\n${name}`;

            if(quests[name].recurring) {
                valueOutput += ` 🔁`;
            }
            if(quests[name].completedBy.includes(interaction.user.id)) {
                valueOutput += ` ✅`;
            }
        }
        
        if(valueOutput) {
            return valueOutput;
        } else {
            return `This server has no quests!`;
        }
    }
    
    const output = new EmbedBuilder()
        .setTitle(`Quests in ${interaction.guild.name}`)
        .setColor(0xbe2ed6)
        .addFields({name: `Page 1 of 1`, value: buildQuestList()});

    interaction.reply({embeds: [output], ephemeral: true});
}

function turnInQuest(logger, interaction, quests) {
    const name = interaction.options.getString(`name`);
    const players = loadPlayers(interaction.guildId, logger);

    if(!players[interaction.user.id]) {
        logger.log(`${interaction.user.tag} does not have a profile`);
        return interaction.reply({content: `You do not have a Totally Epic Quests profile, ${interaction.member.displayName}!`, ephemeral: true});
    }

    logger.log(`Attempting to turn in the ${name} quest`);
    
    if(!quests[name]) {
        logger.log(`No quest named ${name} exists`);
        return interaction.reply({content: `There's no quest named ${name}!`, ephemeral: true});
    }

    if(!quests[name].recurring) {
        if(quests[name].completedBy.includes(interaction.user.id)) {
            logger.log(`${interaction.user.tag} has already completed quest "${name}"`);
            return interaction.reply({content: `You have already completed ${name}!`, ephemeral: true});
        }
    }

    if(quests[quests[name].prerequisite]) {
        if(!quests[quests[name].prerequisite].completedBy.includes(interaction.user.id)) {
            logger.log(`${interaction.user.tag} has not completed the prerequisite quest ${quests[name].prerequisite}`);
            return interaction.reply({content: `You must complete ${quests[name].prerequisite} before turning in this quest!`, ephemeral: true});
        }
    }

    const config = loadConfig(interaction.guildId, logger);

    interaction.guild.channels.fetch(config.modChannel)
        .then(channel => {
            logger.log(`Sending approval request to the server's mod channel`);

            const embed = new EmbedBuilder()
                .setColor(0xbe2ed6)
                .setTitle(`Turn-In Request`)
                .setDescription(`${interaction.user} wants to turn in the ${name} quest`)
                .addFields(
                    { name: `${name} quest description`, value: `${quests[name].description}` },
                    { name: `Action taken`, value: `None yet`}
                );
            
            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`approve`)
                        .setLabel(`Approve`)
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`deny`)
                        .setLabel(`Deny`)
                        .setStyle(ButtonStyle.Danger)
                );
            
            channel.send({embeds: [embed], components: [buttons]})
                .then(message => {
                    logger.log(`Registering the approval request message in the config file`);

                    config.turnInMessages[message.id] = new TurnInMessage(interaction.user.id, name);
                    saveConfig(interaction.guildId, config, logger);
                });
        });

    interaction.reply({content: `Turning in your ${name} quest!  A moderator must approve it before you can claim your reward.`, ephemeral: true});
}

function viewQuest(logger, interaction, quests) {
    let name = interaction.options.getString(`name`);
            
    if(!quests[name]) {
        logger.log(`No quest named ${name} exists`);
        return interaction.reply({content: `There's no quest named ${name}!`, ephemeral: true});
    }

    logger.log(`Viewing quest "${name}"`);

    const embedTitle = `${name}${quests[name].recurring ? ` 🔁` : ``}${quests[name].completedBy.includes(interaction.user.id) ? ` ✅` : ``}`;

    const output = new EmbedBuilder()
        .setTitle(embedTitle)
        .setColor(0xbe2ed6)
        .setDescription(quests[name].description)
        .addFields(
            {name: `Reward`, value: quests[name].reward.toString()},
            {name: `Prerequisite`, value: quests[name].prerequisite ? quests[name].prerequisite : `None`}
        );

    interaction.reply({embeds: [output], ephemeral: true});
}

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
                .setRequired(true))
            .addBooleanOption(option => option
                .setName(`recurring`)
                .setDescription(`Whether or not the quest is recurring.  Recurring quests can be completed any number of times.`))
            .addStringOption(option => option
                .setName(`prerequisite`)
                .setDescription(`The quest to be completed before accepting this quest`)
                .setAutocomplete(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`delete`)
            .setDescription(`Delete an existing quest.`)
            .addStringOption(option => option
                .setName(`name`)
                .setDescription(`The name of the quest to delete`)
                .setRequired(true)
                .setAutocomplete(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`list`)
            .setDescription(`View a list of all available quests.`))
        .addSubcommand(subcommand => subcommand
            .setName(`edit`)
            .setDescription(`Edit an existing quest.`)
            .addStringOption(option => option
                .setName(`name`)
                .setDescription(`The name of the quest`)
                .setRequired(true)
                .setAutocomplete(true))
            .addStringOption(option => option
                .setName(`new-name`)
                .setDescription(`The new name of the quest`))
            .addStringOption(option => option
                .setName(`description`)
                .setDescription(`A short description for the quest`))
            .addNumberOption(option => option
                .setName(`reward`)
                .setDescription(`How much experience a member recieves upon completing the quest`))
            .addBooleanOption(option => option
                .setName(`recurring`)
                .setDescription(`Whether or not the quest is recurring.  Recurring quests can be completed any number of times.`))
            .addStringOption(option => option
                .setName(`prerequisite`)
                .setDescription(`The quest to be completed before accepting this quest`)
                .setAutocomplete(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`view`)
            .setDescription(`View more info on a specific quest`)
            .addStringOption(option => option
                .setName(`name`)
                .setDescription(`The name of the quest to view`)
                .setRequired(true)
                .setAutocomplete(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`turn-in`)
            .setDescription(`Turn in your current quest and claim the reward (requires moderator approval).`)
            .addStringOption(option => option
                .setName(`name`)
                .setDescription(`The name of the quest to turn in.`)
                .setRequired(true)
                .setAutocomplete(true))),
    async execute(logger, interaction) {
        logger.newline();
        logger.log(`${interaction.user.tag} used /quest`);

        const quests = loadQuests(interaction.guildId, logger);

        if(interaction.options.getSubcommand() === `create`) {
            logger.log(`Subcommand: create`);

            permissionCheck(logger, interaction, PermissionFlagsBits.ManageGuild, () => createQuest(logger, interaction, quests));
            return;
        }
        if(interaction.options.getSubcommand() === `delete`) {
            logger.log(`Subcommand: delete`);

            permissionCheck(logger, interaction, PermissionFlagsBits.ManageGuild, () => deleteQuest(logger, interaction, quests));
            return;
        }
        if(interaction.options.getSubcommand() === `list`) {
            logger.log(`Subcommand: list`);

            listQuests(interaction, quests);
            return;
        }
        if(interaction.options.getSubcommand() === `edit`) {
            logger.log(`Subcommand: edit`);

            permissionCheck(logger, interaction, PermissionFlagsBits.ManageGuild, () => editQuest(logger, interaction, quests));
            return;
        }
        if(interaction.options.getSubcommand() === `view`) {
            logger.log(`Subcommand: view`);
            
            viewQuest(logger, interaction, quests);
            return;
        }
        if(interaction.options.getSubcommand() === `turn-in`) {
            logger.log(`Subcommand: turn-in`);

            turnInQuest(logger, interaction, quests);
        }
    },
    async autocomplete(logger, interaction) {
        const focusedOption = interaction.options.getFocused(true);
        logger.newline();
        logger.log(`Autocompleting the /quest ${interaction.options.getSubcommand()} ${focusedOption.name} option`);

        const quests = loadQuests(interaction.guildId, logger);
        let choices = [];

        if(focusedOption.name === `name` || focusedOption.name === `prerequisite`) {
            choices = Object.keys(quests);
        }

        const filteredChoices = choices.filter(choice => choice.startsWith(focusedOption.value));
        // if(filteredChoices.length <= 25) {
            await interaction.respond(filteredChoices.map(choice => ({name: choice, value: choice})));
        // }
    }
}