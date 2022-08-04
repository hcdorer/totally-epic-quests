module.exports = {
    name: "interactionCreate",
    run: async (bot, interaction) => {
        const {client} = bot

        if(!interaction.isCommand()) {
            return
        }
    
        if(!interaction.inGuild()) {
            return interaction.reply("This command can only be used in a server")
        }
    
        const slashCommand = client.slashcommands.get(interaction.commandName)
    
        if(!slashCommand) {
            return interaction.reply("Invalid slash command")
        }
    
        if(slashCommand.permission && !interaction.member.permissions.has(slashCommand.permission)) {
            return interaction.reply("You do not have permission for this command")
        }
    
        slashCommand.run(client, interaction)
    }
}