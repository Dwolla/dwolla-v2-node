module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/**/*.d.ts"],
    coverageDirectory: "<rootDir>/coverage",
    rootDir: "./",
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.(spec|test).ts", "!**/(build|bundle)/**/*"]
};
