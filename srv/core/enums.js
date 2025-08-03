"use-strict";

/**
 * Standard HTTP methods.
 * @readonly
 * @enum {String}
 */
const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
    HEAD: "HEAD",
    OPTIONS: "OPTIONS",
    TRACE: "TRACE",
    CONNECT: "CONNECT",
};


/**
 * Proxy type that SAP BTP destinations use. 
 * @readonly
 * @enum {String}
 * */
const PROXYTYPE = { INTERNET: "Internet", ONPREMISE: "OnPremise", NONE: "none" };

/**
 * HTTP Protocol types
 * @readonly
 * @enum {String}
 */
const PROTOCOL = { HTTP: "http:", HTTPS: "https:" };

/**
 * Standard HTTP Codes
 * @readonly
 * @enum {Number}
 */
const HTTP_STATUS = {
    /** @property {Number} OK - 200: The request has succeeded */
    OK: 200,
    /** @property {Number} CREATED - 201: The request has been fulfilled and has resulted in one or more new resources being created */
    CREATED: 201,
    /** @property {Number} ACCEPTED - 202: The request has been accepted for processing, but the processing has not been completed */
    ACCEPTED: 202,
    /** @property {Number} NO_CONTENT - 204: The server has successfully fulfilled the request and there is no additional content to send in the response payload body */
    NO_CONTENT: 204,
    /** @property {Number} PARTIAL_CONTENT - 206: The server is delivering only part of the resource due to a range header sent by the client */
    PARTIAL_CONTENT: 206,
    /** @property {Number} MULTIPLE_CHOICES - 300: The request has more than one possible response */
    MULTIPLE_CHOICES: 300,
    /** @property {Number} MOVED_PERMANENTLY - 301: The URI of the requested resource has been changed permanently */
    MOVED_PERMANENTLY: 301,
    /** @property {Number} FOUND - 302: The URI of the requested resource has been changed temporarily */
    FOUND: 302,
    /** @property {Number} SEE_OTHER - 303: The response to the request can be found under another URI using a GET method */
    SEE_OTHER: 303,
    /** @property {Number} NOT_MODIFIED - 304: The resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match */
    NOT_MODIFIED: 304,
    /** @property {Number} TEMPORARY_REDIRECT - 307: The URI of the requested resource has been changed temporarily */
    TEMPORARY_REDIRECT: 307,
    /** @property {Number} PERMANENT_REDIRECT - 308: The URI of the requested resource has been changed permanently */
    PERMANENT_REDIRECT: 308,
    /** @property {Number} BAD_REQUEST - 400: The server could not understand the request due to invalid syntax */
    BAD_REQUEST: 400,
    /** @property {Number} UNAUTHORIZED - 401: The client must authenticate itself to get the requested response */
    UNAUTHORIZED: 401,
    /** @property {Number} FORBIDDEN - 403: The client does not have access rights to the content */
    FORBIDDEN: 403,
    /** @property {Number} NOT_FOUND - 404: The server can not find the requested resource */
    NOT_FOUND: 404,
    /** @property {Number} CONFLICT - 409: The request could not be completed due to a conflict with the current state of the resource */
    CONFLICT: 409,
    /** @property {Number} IAM_A_TEAPOT - 418: The server refuses to brew coffee because it is, permanently, a teapot.*/
    IAM_A_TEAPOT: 418,
    /** @property {Number} UNPROCESSABLE_CONTENT 422: The request cannot be processed since sever understands the content type and syntax is correct but unable to process it.*/
    UNPROCESSABLE_CONTENT: 422,
    /** @property {Number} INTERNAL_SERVER_ERROR - 500: The server has encountered a situation it doesn't know how to handle */
    INTERNAL_SERVER_ERROR: 500,
    /** @property {Number} BAD_GATEWAY - 502: The server was acting as a gateway or proxy and received an invalid response from the upstream server */
    BAD_GATEWAY: 502,
    /** @property {Number} SERVICE_UNAVAILABLE - 503: The server is not ready to handle the request */
    SERVICE_UNAVAILABLE: 503,
    /** @property {Number} GATEWAY_TIMEOUT - 504: The server is acting as a gateway or proxy and did not receive a timely response from the upstream server */
    GATEWAY_TIMEOUT: 504,
};


/**
 * Available Authentication types for BTP destination.
 * @readonly
 * @enum {String}
*/
const AUTHTYPE = {
    noAuth: "NoAuthentication",
    basic: "BasicAuthentication",
    clientCertAuth: "ClientCertificateAuthentication",
    principal: "PrincipalPropagation",
    oAuthClientCredentials: "OAuth2ClientCredentials",
    app2appSSO: "AppToAppSSO",
    sapAssertSSO: "SAPAssertionSSO",
};


module.exports = {
    HTTP_METHODS,
    HTTP_STATUS,
    PROTOCOL,
    PROXYTYPE,
    AUTHTYPE
}