const { loadConfig } = require("../game/gameData");
const { loadPatchNotes } = require(`../utils/util-functions.js`);
const { patchNotesFile } = require(`../config.json`);

module.exports = {
    name: "ready",
    once: true,
    async execute(logger, onStartup, client) {
        logger.log(`Logged in as ${client.user.tag}`);

        onStartup(client);

        if(!patchNotesFile) {
            return;
        }

        loadPatchNotes(logger, patchNotesFile)
            .then(patchNotesText => {
                logger.log(`Attempting to send patch note file to each guild that the bot is in`);
        
                client.guilds.fetch();
                client.guilds.cache.forEach(guild => {
                    const config = loadConfig(guild.id, logger);
                    if(!config) {
                        logger.log(`Could not find config for guild ${guild.name} (id ${guild.id})`);
                        return;
                    }

                    if(!config.messageChannel) {
                        logger.log(`Guild ${guild.name} (id ${guild.id}) does not have a message channel set`);
                        return;
                    }

                    if(!patchNotesText) {
                        logger.log(`Patch notes file was empty`);
                        return;
                    }

                    guild.channels.fetch(config.messageChannel)
                        .then(channel => {
                            logger.log(`Sending patch notes to ${guild.name} (id ${guild.id}) message channel #${channel.name} (id ${channel.id})`);
                            channel.send(patchNotesText);
                        });
                });
            });
    }
}