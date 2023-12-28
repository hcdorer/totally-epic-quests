const fs = require("fs");
const path = require(`path`);

/**
 * @param {Object} source 
 * @param {Object} target 
 */
function convertObject(source, target) {
    for(let key in source) {
        if(key in target) {
            target[key] = source[key];
        }
    }
    return target;
}

function permissionCheck(logger, interaction, permission, onPass, onFail = null) {
    if(interaction.memberPermissions.has(permission)) {
        onPass();
    } else {
        if(!onFail) {
            logger.log(`${interaction.user.tag} does not have permission to do this`);
            interaction.reply("You do not have permission to do this!");
        } else {
            onFail();
        }
    }
}

/**
 * @param {Logger} logger 
 * @param {string} patchNoteFile
 * @returns {Promise<string>}
 */
function loadPatchNotes(logger, patchNoteFile) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        const patchNotePath = path.join(__dirname, `patch-notes`, patchNoteFile);
        let patchNotesText = ``;

        logger.log(`Reading patch note file located at ${patchNotePath}`);
        fs.readFile(patchNotePath, `utf8`, (error, data) => {
            if(error) {
                throw(error);
            }
            
            patchNotesText = data;

            resolve(patchNotesText);
        });
    });
}

module.exports = { convertObject, permissionCheck, loadPatchNotes, }