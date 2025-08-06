

/**
 * Utility class containing common and frequenlty reuasable static functions.
 * @class
 * @public
 */
class Util {
    /**
     * Converts a given date object to its odata datetime representation string.
     * @param {Date} date - The date object.
     * @returns {String} The datetime representation of the date object.
     * @static
     */
    static getOdataDateTimeString(date) {
        return date.toISOString().replace(/\.\d{3}Z$/, '')
    }
}


module.exports = { Util }