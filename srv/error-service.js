
const cds = require("@sap/cds");
const { Handlers } = require('./handlers');

class ConfigurationService extends cds.ApplicationService {

    init() {

        this.on('triggerWorkflow', Handlers.triggerWorkflowHandler);

        return super.init();
    }

}

class WorkflowService extends cds.ApplicationService {
    init() {
        this.on('erroneousFlows', async (req, res, next) => {
            return [];
        })
        return super.init();
    }
}


module.exports = {
    ConfigurationService,
    WorkflowService
};