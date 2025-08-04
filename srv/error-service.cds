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
    function logs()             returns Response;

    @(restrict: [{
        grant: '*',
        to   : [
            'App-Admin',
            'Firefighter'
        ]
    }])
    function health()           returns Response;


}


service WorkflowService {

    type workflowErrorDetails {
        wfInstanceId        : String;
        errCatGroup         : String;
        errCategory         : String;
        logicalSystemid     : String(4);
        targetCompanyCode   : String(10);
        messageNumber       : Integer;
        responsibleTeam     : String;
        responsibleTeamName : String;
        status              : String;
        interfaceName       : String;
        messageClass        : String;
        transactionId       : String;
        messageText         : String;
    }


    function erroneousFlows() returns array of workflowErrorDetails;
}

service Configuration {

    action triggerWorkflow()    returns Response;

}


service GRDCErrorWorkflowService {


}
