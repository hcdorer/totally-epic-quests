const { loadConfig, loadQuests, loadPlayers, savePlayers, saveQuests, saveConfig } = require("../game/gameData.js");
const { PermissionFlagsBits } = require(`discord.js`);
const { levelUp } = require(`../game/player.js`);
const { addRankRole } = require("../game/rankRole.js");
const { permissionCheck } = require("../utils/util-functions.js");

module.exports = {
    name: `approve`,
    async execute(logger, interaction) {
        logger.newline();
        logger.log(`${interaction.user.tag} pressed an "approve" button on message ${interaction.message.id}`);

        permissionCheck(logger, interaction, PermissionFlagsBits.ManageGuild, () => {
            const config = loadConfig(interaction.guildId, logger);
            const turnInMessage = config.turnInMessages[interaction.message.id];
    
            if(!turnInMessage) {
                logger.log(`There was no turn in message data associated with this message`);
                return interaction.update({content: `This message did not have any associated turn-in request data!  How strange...`, embeds: [], components: []});
            }
    
            const players = loadPlayers(interaction.guildId, logger);
            if(!players[turnInMessage.playerId]) {
                logger.log(`There is no player with id ${turnInMessage.playerId}`);
                logger.newline;
                
                delete config.turnInMessages[interaction.message.id];
                return interaction.update({content: `That user does not have a Totally Epic Quests profile!`, embeds: [], components: []});
            }
    
            const quests = loadQuests(interaction.guildId, logger);
            if(!quests[turnInMessage.questName]) {
                logger.log(`There is no quest named ${turnInMessage.questName}`);
    
                delete config.turnInMessages[interaction.message.id];
                return interaction.update({content: `There is no quest named ${turnInMessage.questName}!`, embeds: [], components: []});
            }

            if(interaction.member.id === turnInMessage.playerId && !config.allowSelfApprovals) {
                logger.log(`${interaction.user.tag} attempted to approve their own turn-in request, but this is not allowed`);

                return interaction.reply({ content: "Nice try, but you aren't allowed to approve your own turn-in requests!", ephemeral: true });
            }
    
            let leveledUp = false;
            players[turnInMessage.playerId].experience += quests[turnInMessage.questName].reward;
            while(players[turnInMessage.playerId].experience >= players[turnInMessage.playerId].expToNextLevel) {
                levelUp(players[turnInMessage.playerId]);
                leveledUp = true;
            }
            
            if(!quests[turnInMessage.questName].completedBy.includes(turnInMessage.playerId)) {
                quests[turnInMessage.questName].completedBy.push(turnInMessage.playerId);
            }

            delete config.turnInMessages[interaction.message.id];
    
            logger.log(`Successfully approved the turn-in request`);
            logger.log(`The player is now level ${players[turnInMessage.playerId].level} and has ${players[turnInMessage.playerId].experience} experience`);
    
            addRankRole(logger, players[turnInMessage.playerId], turnInMessage.playerId, config, interaction.guild);
    
            savePlayers(interaction.guildId, players, logger);
            saveQuests(interaction.guildId, quests, logger);
            saveConfig(interaction.guildId, config, logger);

            const embed = interaction.message.embeds[0]; // since there is only one embed on the message
            const actionTakenField = embed.fields.find(field => field.name === `Action taken`);

            if(actionTakenField) {
                actionTakenField.value = `Approved by ${interaction.user}`;
            }
            
            interaction.update({embeds: [embed], components: []});
    
            interaction.guild.channels.fetch(config.messageChannel)
                .then(channel => interaction.client.users.fetch(turnInMessage.playerId)
                    .then(user => {
                        channel.send(`Congratulations ${user}, you have completed the ${turnInMessage.questName} quest and recieved your rewards!`);
                        if(leveledUp) {
                            channel.send(`You've also leveled up to level ${players[turnInMessage.playerId].level}!`);
                        }
                    }));
        });
    }
}