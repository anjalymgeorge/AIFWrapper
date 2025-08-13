"use-strict";
const { FailedOdataRequest, ApplicationError, FailedRestRequest } = require('./core/errors');
const { HTTP_METHODS, HTTP_STATUS } = require('./core/enums');
const { Connectivity } = require('./core/connectivity');

const { Util } = require('./utils/common');

const { EnvironmentConfig } = require('./config');


class Handlers {
    /**
     * Return the tasks assigned users.
     */
    static async getUserTasks(req, next) {
        try {
            const getTaskContextExecutions = [];

            const definationId = EnvironmentConfig.aifWorkflowDefinationId;

            const endpoint = "/public/workflow/odata/v1/tcm/TaskCollection";

            const workflowDestination = "ProcessAutomationWithUserPropagation";

            const wfConnectivityService = Connectivity.for(workflowDestination);

            /**
             * Gets context that was used to trigger the workflow and create this task instance
             * @param {String} instanceId 
             * @returns {{}} The start event context.
             * @throws {FailedRestRequest} - If the HTTP request fails.
             */
            const _getInstanceContext = async function (instanceId) {
                const endpoint = `/public/workflow/rest/v1/task-instances/${instanceId}/context`;
                const response = await wfConnectivityService.request(endpoint, HTTP_METHODS.GET);
                if (response.status !== HTTP_STATUS.OK) {
                    throw new FailedRestRequest(response);
                }
                const data = response.body?.startEvent?.errordetails ?? {};
                return data;
            };

            // configure connectivity service.
            wfConnectivityService
                // register req 
                .registerClientRequest(req)
                // set user token
                .setUserTokenFromRequest();

            const response = await wfConnectivityService.request(`${endpoint}`, HTTP_METHODS.GET);
            // If the user has permissions
            if (response.status !== HTTP_STATUS.OK) {
                throw new FailedOdataRequest(response);
            }

            const taskCollections = response.body?.d?.results ?? [];
            // get the task context for each instance id parallely.
            taskCollections.map((taskcollection) => {
                getTaskContextExecutions.push(_getInstanceContext(taskcollection.InstanceID));
            });
            const results = await Promise.allSettled(getTaskContextExecutions);

            const userTasks = results.map((result) => result.value);
            // create the response body for current request.
            return userTasks;
        } catch (err) {
            console.error(`[ERROR] Unable to get user tasks.`, err);
            if (err instanceof ApplicationError) {
                return req.error(err.error_reponse);
            }
            return req.error(500, err.message);
        }
    }

    static userTasksReponse(data) {
        return [];
    }

    static async triggerWorkflowHandler(req, next) {

        const data = await Handlers._createWorkflowTasks(req);

    }

    /**
     * Triggers the workflow with the passed context.
     */
    static async _triggerWorkflow(context, req) {
        const endpoint = "/public/workflow/rest/v1/workflow-instances"
        /**The workflow destinaiton name string. */
        const workflowDestination = "ProcessAutomation";

        return new Promise(async (res, rej) => {
            try {
                const wfConnectivity = Connectivity.for(workflowDestination);
                // wfConnectivity.registerClientRequest(req).setUserTokenFromRequest();
                const response = await wfConnectivity.request(endpoint, HTTP_METHODS.POST, context);

                // check status.
                if (response.status !== HTTP_STATUS.CREATED) {
                    throw (response);
                }

                res(response);
            } catch (error) {
                console.error(`[ERROR] Unable to trigger workflow.`, error);
                rej(error);
            }
        });

    }

    //TODO: move this to a sperate worflow handler module.

    static async _createWorkflowTasks(req) {
        try {
            const definationId = EnvironmentConfig.aifWorkflowDefinationId;
            const worflowExecutions = [];
            const errorsForTasksToBeCreated = await Handlers._getErrorsForPreviousHour(req) ?? [];

            //TODO: need to implement a check function that will check if an instance of wf is running for the current error
            errorsForTasksToBeCreated.slice(0, 5).forEach((data) => {
                const context = {
                    "definitionId": definationId,
                    "context": {
                        "errordetails": {
                            //NOTE: Hardcoded 
                            "errCatGroup": "Mapping",
                            "errCat": data?.ErrorCategory,
                            //NOTE: SYS id is hardcoded  
                            "logicalSystemid": "DGM",
                            "targetCompanyCode": "",
                            "messageNumber": data?.MsgNumber,
                            "responsibleTeam": "",
                            "responsibleTeamName": "",
                            "status": "",
                            "interfaceName": data?.InterfaceName,
                            "messageClass": data?.MsgClass,
                            "transactionId": "",
                            "messageText": data?.FinalText,
                            "MsgNumber": "",
                            "msgGuid": data?.msgGuid,
                            "interfaceVer": data?.InterfaceVer,
                            "numberOfErrors": data?.NumberOfErrors,
                            "numberOfWarnings": data?.NumberOfWarnings,
                            "numberOfSuccess": data?.NumberOfSuccess,
                            "lastUser": data?.LastUser,
                            "lastDate": Util.getISODateStringFromOdataDate(data?.LastDate),
                            "createUser": data?.CreateUser,
                            "createDate": Util.getISODateStringFromOdataDate(data?.CreateDate)
                        }
                    }
                }

                worflowExecutions.push(Handlers._triggerWorkflow(context, req));
            });

            const executionResults = await Promise.allSettled(worflowExecutions);

            return executionResults;
        } catch (err) {
            console.error(`[ERROR] Unable to create workflows tasks.`, err);
        }
    }

    /**
     * Gets the Error data for the time block of an hour before from current time.
     * @param {} req The client request object
     * @returns {Array.<{}>} The array of error.
     * @throws {Error} 
     * @private
     * @static
     */
    static async _getErrorsForPreviousHour(req) {
        try {
            const dgnDestination = "DGN_AIF";
            /**@type {Date} the current datetime */
            const now = new Date();
            /**@type {Date} the datetime an hour earlier */
            const hourBefore = new Date(new Date().setHours(now.getHours() - 1));

            /**The url endpoint from the  */
            const endpoint = "/sap/opu/odata/sap/ZAIF_ERRORS_CDS/zaif_errors"


            const filterParam = `CreateDate le datetime'${Util.getOdataDateTimeString(now)}' and CreateDate ge datetime'${Util.getOdataDateTimeString(hourBefore)}'`

            const dgnConnectivity = Connectivity.for(dgnDestination);
            dgnConnectivity.registerClientRequest(req).setUserTokenFromRequest();

            // Do a http call. 
            const response = await dgnConnectivity.request(`${endpoint}`, HTTP_METHODS.GET, undefined);
            if (response.status !== HTTP_STATUS.OK) {
                throw new Error(`HTTP request to backend failed due to- ${response.status | response?.status_message}. Error: ${JSON.stringify(response?.body)}`);
            }

            return response?.body?.d?.results ?? [];
        } catch (error) {
            console.error(`[ERROR] Unable to get data from backend.`, error);
            // propagate the error.
            throw error;
        }
    }
}


module.exports = { Handlers }