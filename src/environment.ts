export interface Environment {
    apiUrl: string;
    tokenUrl: string;
}

export interface EnvironmentDefaults {
    production: Environment;
    sandbox: Environment;
}

const ENVIRONMENT: EnvironmentDefaults = {
    production: {
        apiUrl: "https://api.dwolla.com",
        tokenUrl: "https://api.dwolla.com/token"
    },
    sandbox: {
        apiUrl: "https://api-sandbox.dwolla.com",
        tokenUrl: "https://api-sandbox.dwolla.com/token"
    }
};

function isEnvironment(obj: any): obj is Environment {
    return "apiUrl" in obj && "tokenUrl" in obj;
}

export default function getEnvironment(environment?: Environment | "production" | "sandbox"): Environment {
    if (!environment) return ENVIRONMENT["production"];
    if (typeof environment === "object" && isEnvironment(environment)) return environment;
    return ENVIRONMENT[environment];
}
