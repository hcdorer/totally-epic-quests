const Discord = require("discord.js");
require("dotenv").config();

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers
    ]
})

let bot = {
    client,
    prefix: "q.",
    owners: ["224217906643206145"]
}

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload);

client.loadEvents(bot, false);

client.login(process.env.TOKEN);

module.exports = bot