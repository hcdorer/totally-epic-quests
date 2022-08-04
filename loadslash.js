const Discord = require("discord.js")
require("dotenv").config()

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers
    ]
})

let bot = {
    client
}

const guildId = "1004492821253869608"

client.slashcommands = new Discord.Collection()
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)
client.loadSlashCommands(bot, false)

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`)
    
    const guild = client.guilds.cache.get(guildId)
    if(!guild) {
        return console.error("Target guild not found")
    }

    await guild.commands.set([...client.slashcommands.values()])
    console.log(`Successfully loaded in ${client.slashcommands.size} slash command(s)`)
    process.exit(0)
})

client.login(process.env.TOKEN)