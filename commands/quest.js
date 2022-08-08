const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const { loadQuests, saveQuests, loadPlayers, savePlayers, loadConfig, saveConfig } = require(`../game/gameData.js`)
const Quest = require(`../game/quest.js`)
const TurnInMessage = require("../game/turnInMessage.js")

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
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`delete`)
            .setDescription(`Delete an existing quest.`)
            .addStringOption(option => option
                .setName(`name`)
                .setDescription(`The name of the quest to delete`)
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`list`)
            .setDescription(`View a list of all available quests.`))
        .addSubcommand(subcommand => subcommand
            .setName(`edit`)
            .setDescription(`Edit an existing quest.`)
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
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`view`)
            .setDescription(`View more info on a specific quest`)
            .addStringOption(option => option
                .setName(`name`)
                .setDescription(`The name of the quest to view`)
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`accept`)
            .setDescription(`Accept a quest!`)
            .addStringOption(option => option
                .setName(`name`)
                .setDescription(`The name of the quest you wish to accept`)
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName(`turn-in`)
            .setDescription(`Turn in your current quest and claim the reward (requires moderator approval).`)),
    async execute(logger, interaction) {
        logger.log(`${interaction.user.tag} used /quest`)

        let quests = loadQuests(logger, interaction.guildId)

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
            
            if(quests[name]) {
                logger.log(`A quest named ${name} already exists`)
                logger.newline()

                return interaction.reply({content: `That quest already exists!`, ephemeral: true})
            }

            quests[name] = new Quest(description, reward)
            saveQuests(logger, interaction.guildId, quests)

            logger.log(`Added new quest "${name}": ${JSON.stringify(quests[name])}`)
            logger.newline()

            interaction.reply({content: `Quest created!`, ephemeral: true})
        }
        if(interaction.options.getSubcommand() === `delete`) {
            logger.log(`Subcommand: delete`)

            if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                logger.log(`${interaction.user.tag} had insufficient permissions`)
                logger.newline()
                
                return interaction.reply({content: `You do not have permission to do this!`, ephemeral: true})
            }

            let name = interaction.options.getString(`name`)

            if(!quests[name]) {
                logger.log(`No quest named ${name} exists`)
                logger.newline()

                return interaction.reply({content: `There's no quest named ${name}!`, ephemeral: true})
            }

            delete quests[name]
            saveQuests(logger, interaction.guildId, quests)

            logger.log(`Deleted the "${name}" quest`)
            logger.newline()

            interaction.reply({content: `Quest deleted!`, ephemeral: true})
        }
        if(interaction.options.getSubcommand() === `list`) {
            logger.log(`Subcommand: list`)

            let output = `The Totally Epic Quests in this server are:\n`

            for(const name in quests) {
                output += `\n${name}` // TODO: include check mark emoji if the quest has been completed
            }

            logger.newline()

            interaction.reply(output)
        }
        if(interaction.options.getSubcommand() === `edit`) {
            logger.log(`Subcommand: edit`)

            if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                logger.log(`${interaction.user.tag} had insufficient permissions`)
                logger.newline()

                return interaction.reply({content: `You do not have permission to do this!`, ephemeral: true})
            }

            let name = interaction.options.getString(`name`)
            let description = interaction.options.getString(`description`)
            let reward = interaction.options.getNumber(`reward`)

            if(!quests[name]) {
                logger.log(`No quest named ${name} exists`)
                logger.newline()

                return interaction.reply({content: `There's no quest named ${name}!`, ephemeral: true})
            }

            quests[name] = new Quest(description, reward)
            saveQuests(logger, interaction.guildId, quests)

            logger.log(`The "${name}" quest is now: ${JSON.stringify(quests[name])}`)
            logger.newline()

            interaction.reply({content: `Quest edited!`, ephemeral: true})
        }
        if(interaction.options.getSubcommand() === `view`) {
            logger.log(`Subcommand: view`)
            
            let name = interaction.options.getString(`name`)
            
            if(!quests[name]) {
                logger.log(`No quest named ${name} exists`)
                logger.newline()

                return interaction.reply(`There's no quest named ${name}!`)
            }

            logger.log(`Viewing quest "${name}"`)

            let output = `__${name}__`
            output += `\n${quests[name].description}`
            output += `\nReward for completion: ${quests[name].reward}`

            logger.newline()

            interaction.reply(output)
        }
        if(interaction.options.getSubcommand() === `accept`) {
            logger.log(`Subcommand: accept`)

            let name = interaction.options.getString(`name`)
            let players = loadPlayers(logger, interaction.guildId)

            if(!quests[name]) {
                logger.log(`No quest named ${name} exists`)
                logger.newline()

                return interaction.reply(`There's no quest named ${name}!`)
            }

            if(!players[interaction.user.id]) {
                logger.log(`${interaction.user.tag} does not have a profile`)
                logger.newline()

                return interaction.reply(`You do not have a Totally Epic Quests profile, ${interaction.member.displayName}!`)
            }

            if(quests[name].completedBy.includes(interaction.user.id)) {
                logger.log(`${interaction.user.tag} has already completed quest "${name}"`)
                logger.newline()

                return interaction.reply(`You have already completed ${name}!`)
            }

            if(players[interaction.user.id].currentQuest === name) {
                logger.log(`${interaction.user.tag} has already accepted quest "${name}"`)
                logger.newline()

                return interaction.reply(`You have already accepted ${name}!`)
            }

            players[interaction.user.id].currentQuest = name
            savePlayers(logger, interaction.guildId, players)
            
            logger.log(`${interaction.user.tag} has accepted quest "${name}"`)
            logger.newline()

            interaction.reply(`Quest accepted!`)
        }
        if(interaction.options.getSubcommand() === `turn-in`) {
            logger.log(`Subcommand: turn-in`)
            
            let players = loadPlayers(logger, interaction.guildId)

            if(!players[interaction.user.id].currentQuest) {
                logger.log(`${interaction.user.tag} does not have a current quest`)
                logger.newline()

                return interaction.reply(`You don't have a quest to turn in!`)
            }

            let config = loadConfig(logger, interaction.guildId)

            logger.log(`Turning in quest ${players[interaction.user.id].currentQuest}`)

            interaction.guild.channels.fetch(config.modChannel)
                .then(channel => {
                    logger.log(`Sending approval request to the server's mod channel`)

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
                        )
                    
                    channel.send({content: `${interaction.member.displayName} is turning in the ${players[interaction.user.id].currentQuest} quest!`, components: [buttons]})
                        .then(message => {
                            logger.log(`Registering the approval request message in the config file`)

                            config.turnInMessages[message.id] = new TurnInMessage(interaction.user.id, players[interaction.user.id].currentQuest)
                            saveConfig(logger, interaction.guildId, config)

                            logger.newline()
                        })
                })

            interaction.reply(`Turning in your quest!  A moderator must approve it before you can claim your reward.`)
        }
    }
}