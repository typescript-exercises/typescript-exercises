function dateWizard(date, format) {
    var details = dateWizard.dateDetails(date);
    return format.replace(/{([^}]+)}/g, function(s, match) {
        return dateWizard.pad(details[match]);
    });
}

dateWizard.pad = function(s) {
    s = String(s);
    while (s.length < 2) {
        s = '0' + s;
    }
    return s;
};

dateWizard.dateDetails = function dateDetails(date) {
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    };
};

dateWizard.utcDateDetails = function getUTCDateDetails(date) {
    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        date: date.getUTCDate(),
        hours: date.getUTCHours(),
        minutes: date.getUTCMinutes(),
        seconds: date.getUTCSeconds()
    };
};

module.exports = dateWizard;
