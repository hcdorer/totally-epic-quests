const { PermissionFlagsBits } = require("discord.js");
const { permissionCheck } = require("../utils/util-functions");

module.exports = {
    name: `dontReset`,
    async execute(logger, interaction) {
        logger.newline();
        logger.log(`${interaction.user.tag} pressed a "dontReset" button on message ${interaction.message.id}`);

        permissionCheck(logger, interaction, PermissionFlagsBits.ManageGuild, () => {
            interaction.update({content: `The current saves will be preserved.`, embeds: [], components: [], ephemeral: true});
        }, () => {
            let messageText = "You do not have permission to do this!";
            messageText += "\nWait...you shouldn't be able to see this button in the first place!";
            messageText += "\nThis is probably a bug; please report it here: https://github.com/hdorer/totally-epic-quests/issues/new/";

            logger.log(`${interaction.user.tag} does not have permission to do this`);
            interaction.reply(messageText);
        });
    }
}