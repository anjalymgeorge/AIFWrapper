const { env } = require("node:process");

/**
 * Fetches the any configuration from the env variables
 */
class EnvironmentConfig {
    /**
     * Gets the data from the environment object.
     * @param {String} variable The key for which data needs to be fetched from env variable.
     * @returns {String|undefined} 
     */
    static getEnvironentVariable(variable) {
        return env[variable];
    }


    /**
     * Returns the workflow defination from 
     * @returns {String|undefined} Returns the defination id if present or returns undefined.
     */
    static get aifWorkflowDefinationId() {
        return EnvironmentConfig.getEnvironentVariable('AIF_WF_DEFINATION_ID');
    }
}


module.exports = { EnvironmentConfig }