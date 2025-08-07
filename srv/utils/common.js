

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
     * @public
     */
    static getOdataDateTimeString(date) {
        return date.toISOString().replace(/\.\d{3}Z$/, '')
    }

    /**
     * Converts a string in `/Date(1706832000000)/` to its equivalent ISO string.
     * @param {String} dateString The odate date string that needs to be converted.
     * @returns {String} ISO string for the created date object.
     * @static
     * @public
     */
    static getISODateStringFromOdataDate(dateString) {
        const datetimeString = dateString.replace(/([\/]|Date|[\(\)])/g, '');
        const date = new Date(datetimeString);
        return date.toISOString();
    }
}


module.exports = { Util }