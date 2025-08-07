/**
 * Generic response type
 */
type Response {
    status   : Integer;
    messsage : String;
}


@path: 'app'
service Applicaiton {

    @(restrict: [{
        grant: '*',
        to   : [
            'App-Admin',
            'Firefighter'
        ]
    }])
    function logs()            returns Response;

    @(restrict: [{
        grant: '*',
        to   : [
            'App-Admin',
            'Firefighter'
        ]
    }])
    function health()          returns Response;


}


service WorkflowService {

    type workflowErrorDetails {
        errCatGroup         : String;
        errCat              : String;
        logicalSystemid     : String;
        targetCompanyCode   : String;
        messageNumber       : String;
        responsibleTeam     : String;
        responsibleTeamName : String;
        status              : String;
        interfaceName       : String;
        messageClass        : String;
        transactionId       : String;
        messageText         : String;
        MsgNumber           : String(10);
        msgGuid             : String;
        interfaceVer        : String(10);
        numberOfErrors      : Integer;
        numberOfWarnings    : Integer;
        numberOfSuccess     : Integer;
        lastUser            : String;
        lastDate            : DateTime;
        createUser          : String;
        createDate          : DateTime;
    }


    function tasks()           returns array of workflowErrorDetails;

    action   triggerWorkflow() returns Response;

}


service GRDCErrorWorkflowService {


}
