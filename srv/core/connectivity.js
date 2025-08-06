const assert = require("node:assert");

const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const { getDestination } = require("@sap-cloud-sdk/connectivity");
const { ErrorWithCause } = require("@sap-cloud-sdk/util");

const { HTTP_METHODS } = require('./enums');


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
 * Additional Options for the request.
 * @typedef REQUESTOPTIONS
 * @prop {Object.<string, any} headers Any additional headers excluding `Autoraization`, `x-csrf-token`, `Cookie` must be added here as a key-value pair.
 * @prop {Array.<String>|Null} includeHeaders additional details name from destiation that needs to be included as headers in the request.
 * @prop {boolean | null} needsxcsrfToken Flag if the request needs an x-csrf-token header to be added.
 * @prop {String|null} xcsrfTokenPath URL to be used when generating the xcsrf token.
 * @prop {CACHEOPTIONS} cacheOptions - Cache options for the current request, for this cache prop must be true.
 */

class Connectivity {

    constructor(destination) {
        this.destinationName = destination;
        /** 
         * Using object to store information that will be used later for processing. 
         * @prop {object} _._vcap_services the current vcap services object for the application.
         */
        this._ = {}
        this._._vcap_services = JSON.parse(process.env.VCAP_SERVICES);
        this.middlewares = [];
    }

    get vcap_services() {
        return this._._vcap_services;
    }

    /**
     * 
     * @param {String} destination The destination for which the connectivity service needs to be intialised.
     * @returns {Connectivity} An connectivity instance for the destination.
     */
    static for(destination) {
        return new Connectivity(destination);
    }

    /**
     * Registers a request to internal object for the connectivity service.
     * @param {cds.Request} req The request from the client that is being served.
     * @returns {Connectivity} Instance of the current connectivity.
     */
    registerClientRequest(req) {
        this._._req = req;
        return this;
    }

    /**
     * Sets the user token from the registered client request.
     */
    setUserTokenFromRequest() {
        this.USER_TOKEN = this._._req._.req?.authInfo?.getTokenInfo()?.getTokenValue();
        return this;
    }

    /**
     * 
     * @returns {Promise<DESTINATION| undefined>}
     */
    async getDestinationConfiguration() {
        if (!this?._?._destinationConfig) {
            this._._destinationConfig = await getDestination({ destinationName: this.destinationName });
        }
        return this._._destinationConfig;
    }


    /**
  * Executes an HTTP request using the SAP Cloud SDK.
  *
  * @param {string} [path] - The path to which data has to be posted. The path should start with '/'.
  * @param {String} method - The HTTP method for the request.
  * @param {Object} data - The data that needs to be sent as payload in JSON format.
  * @param {REQUESTOPTIONS} [options=null] - The options to be included with the request.
  * @returns {Promise.<{status: number, body: any, headers: any}>} - A promise that resolves to an object containing the HTTP response status, body, and headers.
  * @throws {SapServiceException} - Throws an error if the request fails.
  */
    async request(path, method = "", data, options = null) {
        try {
            assert(Object.values(HTTP_METHODS).includes(method), new Error(`[ERROR] Method must be one of standard http methods - ${Object.values(HTTP_METHODS).join(',')}`));
            console.info(`[INFO] Doing a ${method} request: ` + this.destinationName + ".dest" + path);

            const response = {};
            const _headers = options?.headers ?? {};



            // destination config to be passed to the http client.
            const destinationConfig = {
                destinationName: this.destinationName,
            };

            //A middle ware to modify the current request config. add to middlewares if only path is defined.
            const modifyRequestParameters = (options) => {
                return (requestConfig) => {
                    requestConfig.url = path;
                    // requestConfig.timeout = timeOut;
                    return options.fn(requestConfig);
                };
            };

            // add the modify if path exists
            if (path) {
                this.middlewares.push(modifyRequestParameters);
            }

            // if user token exisits add user token to destination config.
            if (this.USER_TOKEN) {
                Object.assign(destinationConfig, { jwt: this.USER_TOKEN });
            }

            // Note all after middleware should be added after this line;
            // this.middlewares.push(this.getStatusTextMiddleware);
            try {
                // adding connection header to improve repeated requests performance to same URL's/API's.
                _headers.Connection = "keep-alive";

                const res = await executeHttpRequest(destinationConfig, { method: method, data: data, headers: _headers, middleware: this.middlewares }, { fetchCsrfToken: options?.needsxcsrfToken ?? false });
                response.status = res.status;
                response.body = res.data;
                response.headers = res.headers;

            } catch (err) {
                console.error(`[ERROR] Error while requesting data from Connection ${this.destinationName}: ${err.message}.`);
                // throws error if status is not found the the error object.
                if (!err.response?.status) {
                    throw new Error(`[ERROR] Unable to complete HTTP request`, err);
                }
                response.body = err.response?.data;
                response.status = err.response?.status;
                response.status_message = err.response?.statusText;
                response.headers = err.response?.headers;
            }
            return response;
        } catch (err) {
            console.error(`[ERROR] Error while requesting data from Connection ${this.destinationName}: ${err.message}.`);
            throw err;
        }
    }
}


module.exports = { Connectivity }