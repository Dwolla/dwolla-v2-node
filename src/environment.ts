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

export default function getEnvironment(environment?: "production" | "sandbox"): Environment {
    return ENVIRONMENT[environment ?? "production"];
}
