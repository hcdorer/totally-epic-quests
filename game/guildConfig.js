class GuildConfig {
    set rankRoles(rankRoles) {
        this.rankRoles = rankRoles
    }
    set modChannel(modChannel) {
        this.modChannel = modChannel
    }
    set messageChannel(messageChannel) {
        this.messageChannel = messageChannel
    }
    set turnInMessages(turnInMessages) {
        this.turnInMessages = turnInMessages
    }

    constructor() {
        this.rankRoles = []
        this.modChannel = ""
        this.messageChannel = ""
        this.turnInMessages = {}
    }
}

module.exports = GuildConfig