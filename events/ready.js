const guildId = "1004492821253869608"

module.exports = {
    name: "ready",
    run: async (bot) => {
        const {client} = bot

        console.log(`Logged in as ${client.user.tag}`)
    
        const guild = client.guilds.cache.get(guildId)
        if(!guild) {
            return console.error("Target guild not found")
        }

        await guild.commands.set([...client.slashcommands.values()])
        console.log(`Successfully loaded in ${client.slashcommands.size} slash command(s)`)
    }
}