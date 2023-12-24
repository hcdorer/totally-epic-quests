const { PermissionFlagsBits } = require("discord.js");
const { permissionCheck } = require("../utils/util-functions");
const { createNewSave } = require(`../game/gameData.js`);

module.exports = {
    name: `reset`,
    async execute(logger, interaction) {
        logger.newline();
        logger.log(`${interaction.user.tag} pressed a "reset" button on message ${interaction.message.id}`);
        
        permissionCheck(logger, interaction, PermissionFlagsBits.ManageGuild, () => {
            createNewSave(logger, interaction);

            logger.log(`Reset Totally Epic Quests in ${interaction.guild.name} (id: ${interaction.guildId})`);
            interaction.update({content: `Totally Epic Quests has been reset in ${interaction.guild.name}!`, embeds: [], components: [], ephemeral: true});
        }, () => {
            let messageText = "You do not have permission to do this!";
            messageText += "\nWait...you shouldn't be able to see this button in the first place!";
            messageText += "\nThis is probably a bug, please report it here: https://github.com/hdorer/totally-epic-quests/issues/new/";

            logger.log(`${interaction.user.tag} does not have permission to do this`);
            interaction.reply(messageText);
        });
    }
}