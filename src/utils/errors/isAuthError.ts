import { AuthError } from "../../errors/AuthError";

export default function (obj: unknown): obj is AuthError {
    return obj instanceof AuthError;
}
