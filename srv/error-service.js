
const cds = require("@sap/cds");
const { Handlers } = require('./handlers');

class ConfigurationService extends cds.ApplicationService {

    init() {
        return super.init();
    }

}

class WorkflowService extends cds.ApplicationService {
    init() {
        this.on('tasks', async (req, next) => {
            return [];
        })

        this.on('triggerWorkflow', async (req, next) => await Handlers.triggerWorkflowHandler(req, next));
        return super.init();
    }
}


module.exports = {
    ConfigurationService,
    WorkflowService
};