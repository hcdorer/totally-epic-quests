const Discord = require("discord.js")

module.exports = {
    name: "messageCreate",
    run: async function runAll(bot, message) {
        const {client, prefix, owners} = bot

        if(!message.guild) {
            return
        }

        if(message.author.bot) {
            return
        }

        if(!message.content.startsWith(prefix)) {
            return
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const commandName = args.shift().toLowerCase()

        let command = client.commands.get(commandName)
        if(!command) {
            return
        }

        let member = message.member
        if(command.devOnly && !owners.includes(member.id)) {
            return message.reply("This command requires top-secret developer permissions.")
        }

        if(command.permissions && member.permissions.missing(command.permissions).length !== 0) {
            return message.reply("You do not have permission to use this command.")
        }

        try {
            await command.run({...bot, message, args})
        } catch(err) {
            let errorMessage = err.toString()

            if(errorMessage.startsWith("?")) {
                errorMessage = errorMessage.slice(1)
                await message.reply(errorMessage)
            } else {
                console.error(err)
            }
        }
    }
}