/* This implementation is pretty much taken entirely from the Discord.JS guide:
https://discordjs.guide/creating-your-bot/command-deployment.html */

const { REST, Routes } = require(`discord.js`);
const { clientId, token } = require(`./config.json`);
const fs = require(`node:fs`);
const path = require(`node:path`);

const guildId = process.argv.slice(2)[0];
if(!guildId) {
    console.log(`No guild ID provided!`);
    process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, `commands`);

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(`.js`));

for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

// console.log(commands)

const rest = new REST().setToken(token);

(async () => {
    console.log(`Deploying ${commands.length} commands to guild with ID ${guildId}`);

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        // eslint-disable-next-line no-unused-vars
        .catch(error => console.error(error));
})();