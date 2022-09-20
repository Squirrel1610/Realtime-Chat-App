const moment = require("moment");
function formatMessage(username, text){
    return {
        username,
        text,
        time: moment().calendar()
    }
}

module.exports = {formatMessage};