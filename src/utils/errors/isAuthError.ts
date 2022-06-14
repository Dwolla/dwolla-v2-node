import { AuthError } from "../../errors";

export default function isAuthError(obj: unknown): obj is AuthError {
    return obj instanceof AuthError;
}
