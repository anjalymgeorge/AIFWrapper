/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    coverageDirectory: 'coverage/integration', // separate coverage for integration tests
    coverageReporters: ['text', 'lcov'],
    randomize: true,
    showSeed: true,
    testTimeout: 30000,  // 30 seconds
    detectLeaks: true,
    reporters: [
        'default',
        [
            'jest-junit',
            {
                suiteName: 'Integration Tests',
                outputDirectory: './results',
                outputName: 'INTEGRATION-TEST-results.xml',
                classNameTemplate: '{classname}',
                titleTemplate: '{title}',
                ancestorSeparator: ' › ',
                usePathForSuiteName: 'true',
            },
        ],
    ],
    projects: [
        {
            displayName: 'unit-tests',
            testMatch: ['tests/**/*.spec.js'],
        },
        {
            displayName: 'integration-tests',
            testMatch: ['tests/integration/**/*.int.test.js'],

        },
        {
            displayName: 'performance-tests',
            testMatch: ['tests/integration/**/*.perf.test.js'],
        },
    ],
};

module.exports = config;