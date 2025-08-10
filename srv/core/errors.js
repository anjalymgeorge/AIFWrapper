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
     * 
     * @param {*} message 
     * @param {*} status 
     * @param {*} statusText 
     * @param {*} cause 
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
            " @cause": cause
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




module.exports = { FailedRestRequest, FailedOdataRequest }