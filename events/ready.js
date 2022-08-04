const { execute } = require("../commands/ping");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`)
    }
}