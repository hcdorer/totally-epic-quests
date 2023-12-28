const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require(`fs`);
const path = require(`path`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Get help with this bot's commands!`),
    async execute(logger, interaction) {
        logger.newline();
        logger.log(`${interaction.user.tag} used /help`);

        interaction.user.send(`${interaction.user.name}, here is a full list of Totally Epic Quests commands!`)
            .then(() => {
                const helpText = path.join(__dirname, `..`, `utils`, `help.txt`);
                const modHelpText = path.join(__dirname, `..`, `utils`, `modhelp.txt`);
                
                fs.readFile(helpText, `utf8`, (err, data) => { 
                    if(err) {
                        throw err;
                    }
                    
                    logger.log(`Sending ${interaction.user.name} the standard help message`);
                    interaction.user.send(data)
                        .then(() => {
                            if(interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                                fs.readFile(modHelpText, `utf8`, (err, data) => {
                                    if(err) {
                                        throw err;
                                    }
            
                                    logger.log(`Sending ${interaction.user.name} the mod help message`);
                                    interaction.user.send(data)
                                        .then(() => interaction.reply({content: `Check your DMs!`, ephemeral: true}))
                                        .catch(error => {
                                            logger.error(error);
                                            interaction.reply({content: `Couldn't send you a DM!  Have you disabled DMs from this server?`, ephemeral: true});
                                        });
                                });
                            }
                        });
                });
            })
            .catch(error => {
                logger.error(error)
                interaction.reply({content: `Couldn't send you a message!`, ephemeral: true})
            });
    }
}