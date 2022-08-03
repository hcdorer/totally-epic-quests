const Discord = require("discord.js");
require("dotenv").config();

const TOKEN = "MTAwNDQ5OTI1MDI3ODgzMDI4MA.Gv3FBx.ENqKum2ZTxPDF4GZCBRWqGLkLptgXD_IuBK23w";

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on("messageCreate", (message) => {
    if(message.content.toLowerCase() == "hi") {
        message.reply(`Hello ${message.author.username}!`);
    }
})

client.login(process.env.TOKEN);