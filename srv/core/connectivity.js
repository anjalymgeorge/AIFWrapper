const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const { getDestination } = require("@sap-cloud-sdk/connectivity");
const { ErrorWithCause } = require("@sap-cloud-sdk/util");


/**
 * Destination config.
 * @typedef {object} DESTINATION
 * @property {String}Name destination name
 * @property {String}Type Destination type
 * @property {String}URL Destination Url
 * @property {String}Authentication Authentication type
 * @property {String}ProxyType Proxy type
 * @property {String|undefined}tokenServiceURLType  Token service type
 * @property {String|undefined}clientId Clinet id for destination
 * @property {String|undefined}Description Descritption
 * @property {String|undefined}scope
 * @property {String|undefined}clientSecret
 * @property {String|undefined}tokenServiceURL
 * @property {String|undefined}Password
 * @property {String|undefined}User
 */

/**
 * 
 */
class Connetitity {

    constructor() {

        this._._vcap_services = JSON.parse(process.env.VCAP_SERVICES)

    }

    static for(destination) {
        return new Connetitity();
    }

    /**
    * Middleware to add the status text to the response.
    */
    getStatusTextMiddleware = (options) => {
        return (requestConfig) => {
            return options.fn(requestConfig).then((response) => {
                return response.text().then((text) => {
                    return { ...response, status_message: text };
                });
            });
        };
    };



}



module.exports = { Connetitity }