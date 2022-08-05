/*
NOTE TO (potential) FUTURE COLLABORATORS:
You must create a file called logs/log.txt (or whatever filename is currently passed into the logger constructor in index.js) at the
root directory of this project!
fs.appendFile() does NOT create a new file if the given file does not exist, even though every source I've found says it should!
If someone can figure out how to circumvent this, or what I'm doing wrong, that would be greatly appreciated!
*/

const fs = require(`fs`)
const path = require(`path`)

class Logger {
    /**
     * @returns {string}
     */
    static now() {
        var nowDate = new Date()
        var dateStr = nowDate.getFullYear() + `-` + (nowDate.getMonth() + 1) + `-` + nowDate.getDate()
        var timeStr = nowDate.getHours() + `:` + (nowDate.getMinutes() < 10 ? ('0' + nowDate.getMinutes()) : nowDate.getMinutes()) + `:` + (nowDate.getSeconds() < 10 ? ('0' + nowDate.getSeconds()) : nowDate.getSeconds())

        return dateStr + ` ` + timeStr
    }

    /** @type {string} */
    #filePath

    /**
     * @param {string} filename
     */
    constructor(filePath) {
        this.#filePath = filePath
        console.log(this.#filePath)
    }

    /**
     * @param {string} message 
     */
    log(message) {
        const output = `${Logger.now()}: ${message}`
        console.log(output)
        fs.appendFile(this.#filePath, `${output}\n`, (err) => {
            if(err) {
                throw err
            }
        })
    }
}

module.exports = Logger