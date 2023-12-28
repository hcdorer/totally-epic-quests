const { Client, Collection, GatewayIntentBits } = require(`discord.js`);
const { token } = require(`./config.json`);
const fs = require(`fs`);
const path = require(`path`);
const Logger = require(`./utils/logger.js`);
const { loadPatchNotes } = require(`./utils/util-functions.js`);
const { loadConfig } = require(`./game/gameData.js`);

/**
 * Parse the arguments passed into the terminal
 * @param {string[]} args should be process.argv.slice(2)
 * @returns Object
 */
// eslint-disable-next-line no-unused-vars
function parseTerminalArgs(args) {
    let result = {};
    
    for(let i = 0; i < args.length; i++) {
        if(args[i] === `.p` || args[i] === `.patch-notes`) {
            i++; // look at the next argument
            result.patchNoteFile = args[i];
        }
    }
    
    return result;
}

const terminalArgs = parseTerminalArgs(process.argv.slice(2));

const client = new Client({intents: [GatewayIntentBits.Guilds]});

var logFilename = `${Logger.now().replaceAll(':', '_')}.txt`;
const logger = new Logger(path.join(__dirname, `logs`, logFilename));

const eventsPath = path.join(__dirname, `events`);
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(`.js`));

for(const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if(event.once) {
        client.once(event.name, (...args) => {
            if(event.name === `ready`) {
                event.execute(logger, client => {
                    if(terminalArgs.patchNoteFile) {
                        loadPatchNotes(logger, terminalArgs.patchNoteFile)
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
                }, ...args);
            } else {
                event.execute(logger, ...args);
            }
        });
    } else {
        client.on(event.name, (...args) => event.execute(logger, ...args));
    }
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, `commands`);
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(`.js`));

for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

client.buttons = new Collection();
const buttonsPath = path.join(__dirname, `buttons`);
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith(`.js`));

for(const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    const button = require(filePath);

    client.buttons.set(button.name, button);
}

logger.log(`Logger initialized; logging to file ${logger.filePath}`);

client.login(token);