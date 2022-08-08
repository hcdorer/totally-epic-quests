const { execute } = require(`../commands/ping.js`);

module.exports = {
    name: "ready",
    once: true,
    execute(logger, client) {
        logger.log(`Logged in as ${client.user.tag}`)
        logger.newline()
    }
}