const fs = require(`fs`);

class Logger {
    /**
     * @returns {string}
     */
    static now() {
        var nowDate = new Date();
        var dateStr = nowDate.getFullYear() + `-` + (nowDate.getMonth() + 1) + `-` + nowDate.getDate();
        var timeStr = nowDate.getHours() + `:` + (nowDate.getMinutes() < 10 ? ('0' + nowDate.getMinutes()) : nowDate.getMinutes()) + `:` + (nowDate.getSeconds() < 10 ? ('0' + nowDate.getSeconds()) : nowDate.getSeconds());

        return dateStr + ` ` + timeStr;
    }

    /** @type {string} */
    filePath;

    /**
     * @param {string} filePath
     */
    constructor(filePath) {
        this.filePath = filePath;
    }

    /**
     * @param {string} message 
     */
    log(message) {
        const output = `${Logger.now()}: ${message}`;
        
        console.log(output);
        fs.appendFileSync(this.filePath, `${output}\n`);
    }

    error(error) {
        this.log(`Error caught, details below:`);

        console.error(error);
        fs.appendFileSync(this.filePath, `${error.stack}`);
    }

    newline() {
        const output = ``;
        
        console.log(output);
        fs.appendFileSync(this.filePath, `${output}\n`);
    }
}

module.exports = Logger;