class Player {
    set level(level) {
        this.level = level
    }
    set experience(experience) {
        this.experience = experience
    }
    set expToNextLevel(expToNextLevel) {
        this.expToNextLevel = expToNextLevel
    }
    set currentQuest(currentQuest) {
        this.currentQuest = currentQuest
    }

    constructor() {
        this.level = 1
        this.experience = 0
        this.expToNextLevel = 0
        this.currentQuest = ""
    }
}

/**
 * @param {Player} player 
 */
function levelUp(player) { // This should be a member of of the Player class, but the players aren't loaded as Players and I can't get prototypes to work.  Fuck Javascript
    player.level++
    player.expToNextLevel = 100 * Math.pow(player.level, 2)
}

module.exports = { Player, levelUp }