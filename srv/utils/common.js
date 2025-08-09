

/**
 * Utility class containing common and frequenlty reuasable static functions.
 * @class
 * @public
 */
class Util {

    /**
     * Inverts the date by doing a 9's complement.
     *
     * A method used by sap to sort dates in few legacy and current tables, so that the latest date is always a higher number for processing.
     * This inversion will be Used for getting filtered values from odata which support invereted date format as a date filter.
     * Will remove addtion of addtional lines to the ODATA Function modules to convert and return data for the reuired date.
     *
     * **Note: The technique of manipulating the sort sequence of dates by inverting the internal date format is now rarely used.**
     *
     * @param {Date} date date object to be converted.
     * @returns {Number} passed date in inverted date format in a decimal format.
     */
    static invertedDate(date) {
        //converts the date to decimal format of yyyymmdd format, a SAP orginal format.
        const _date = date.getUTCFullYear() * 10000 + (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
        return 99999999 - _date;
    }

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
        const datetime = new Number(dateString.replace(/([\/]|Date|[\(\)])/g, ''));
        const date = new Date(datetime);
        return date.toISOString();
    }
}


module.exports = { Util }