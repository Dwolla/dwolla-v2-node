import { Client } from "../Client";
import { Environment } from "../environment";

export abstract class BaseApi {
    constructor(private client: Client) {}

    protected buildUrl(...parts: string[]): string {
        const environment: Environment = this.getClient().environment;

        return parts.reduce((previousValue: string, currentValue: string) => {
            if (currentValue === environment.apiUrl || currentValue.startsWith(`${environment.apiUrl}/`)) {
                return this.trimSlashes(currentValue);
            } else if (currentValue.includes(":")) {
                throw Error(`Invalid host (${currentValue}). Must start with ${environment.apiUrl} or an empty string`);
            } else {
                return `${previousValue}/${this.trimSlashes(currentValue)}`;
            }
        });
    }

    protected getClient(): Client {
        return this.client;
    }

    private removePrefix(search: string, str: string): string {
        return str.replace(new RegExp(`^${search}`), "");
    }

    private removeSuffix(search: string, str: string): string {
        return str.replace(new RegExp(`${search}$`), "");
    }

    private trimSlashes(str: string): string {
        return this.removePrefix("/", this.removeSuffix("/", str));
    }
}
