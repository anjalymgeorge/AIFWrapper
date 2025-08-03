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
    function logs()          returns Response;

    @(restrict: [{
        grant: '*',
        to   : [
            'App-Admin',
            'Firefighter'
        ]
    }])
    function health()          returns Response;


}

service Configuratior {

    action triggerWorkflow() returns Response;


}


service GRDCErrorWorkflow {


}
