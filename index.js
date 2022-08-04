const { Client, GatewayIntentBits } = require("discord.js")
const { token } = require("./config.json")

const client = new Client({intents: [GatewayIntentBits.Guilds]})

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on("interactionCreate", async interaction => {
    if(!interaction.isChatInputCommand()) {
        return;
    }

    const { commandName } = interaction

    if(commandName === "ping") {
        await interaction.reply("Pong!")
    }
})

client.login(token)