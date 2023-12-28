module.exports = {
    name: "ready",
    once: true,
    async execute(logger, onStartup, client) {
        logger.log(`Logged in as ${client.user.tag}`);

        onStartup(client);
    }
}