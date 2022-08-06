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
    filePath

    /**
     * @param {string} filename
     */
    constructor(filePath) {
        this.filePath = filePath
    }

    /**
     * @param {string} message 
     */
    log(message) {
        const output = `${Logger.now()}: ${message}`
        console.log(output)
        fs.appendFile(this.filePath, `${output}\n`, (err) => {
            if(err) {
                throw err
            }
        })
    }
}

module.exports = Logger