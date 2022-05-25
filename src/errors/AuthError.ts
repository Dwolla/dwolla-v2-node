import { AuthResponse } from "../Auth";
import { DwollaError } from "./DwollaError";

export class AuthError extends DwollaError {
    readonly error: string;

    constructor(response: AuthResponse) {
        super(JSON.stringify(response.error));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.error = response.error!;
    }
}
