
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
            const tasks = await Handlers.getUserTasks(req, next);
            return tasks;
        })

        this.on('triggerWorkflow', async (req, next) => await Handlers.triggerWorkflowHandler(req, next));
        return super.init();
    }
}


module.exports = {
    ConfigurationService,
    WorkflowService
};