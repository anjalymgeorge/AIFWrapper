"use-strict";

/**
 * Base class for all other error classes
 * @class
 * @extends Error
 */
class ApplicationError extends Error {
    #defaultErrorResponse = {
        //NOTE: not using HTTP_STATUS from enums, since it can create a circular import going forward.
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "The server encountered an internal error or misconfiguration and was unable to complete your request.",
    };

    /**
     * The current error status response that will be sent back to the client.
     * @type {{status:number,code:string,message:string, '@cause': String|undefined}|undefined}
     */
    #errorResponse = undefined;
    /**
     * Base class for all other error classes
     * @param {String} message - The error message.
     * @param {Number} status - The HTTP status code.
     * @param {String} statusText - The HTTP status code text.
     * @param {String|undefined} cause - Additional message to support the error, or describing more about the error. 
     */
    constructor(message, status, statusText, cause) {
        super(message, { cause: cause });
        this.status = status;
        this.statusText = statusText;
        this.name = "Application Error"

        this.#errorResponse = {
            status: status,
            code: statusText,
            message: message,
            "@cause": cause
        }

    }


    /**
     * Generates the HTTP reponse, that needs to be sent back using current properties.
     * 
     * If current error response is empty, returns the default response instead.
     * @returns {{status:number,code:string,message:string, '@cause': String|undefined}} The error response.
     */
    get error_reponse() {
        return this.#errorResponse ?? this.default_response;
    }

    /**
     * A default error message, if the current response has not been constructed.
     * @returns {{status:number,code:string,message:string}}
     */
    get default_response() {
        return this.#defaultErrorResponse;
    }

}


//TODO: make a HTTPRequestClass that will be parent for this and rest, that will have switch cases for common http failed status.
//TODO: add a flag if need to propagate the server error, i.e: since errors like 404 or 401 or 403 can be propagated back to client, but for other error eg:400, since our app has created the request incorrect, that should be sent as an internal server error instead, to avoid confusion.
// Or we can add it payload eg @server_response and then show the original error or add it to @cause.
/**
 * Error when an REST request fails with a  non-success HTTP status.
 */
class FailedRestRequest extends ApplicationError {

    constructor(response) {
        // extract response from the body
        // for status 401, the body is different
        // TODO: try to create a class that handles the HTTP error, common status code failes are added over there.
        const errorBody = response.body
        let message;
        let cause;
        if (response.status === 401) {
            message = errorBody.error;
            cause = errorBody.error_description;
        } else {
            message = errorBody.error.message;
            cause = errorBody.error?.details?.message;
        }
        super(message, response.status, response.status_message, cause);
    }
}



/**
 * Error when an Odata request fails with a  non-success HTTP status.
 */
class FailedOdataRequest extends ApplicationError {
    constructor(response) {
        const errorBody = response.body
        let message;
        let cause;
        if (response.status === 401) {
            message = errorBody.error;
            cause = errorBody.error_description;
        } else {
            message = errorBody.error.code;
            cause = errorBody.error?.message?.value;
        }
        super(message, response.status, response.status_message, cause);
    }
}




module.exports = { ApplicationError, FailedRestRequest, FailedOdataRequest }