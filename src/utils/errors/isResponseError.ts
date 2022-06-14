import { ResponseError } from "../../errors";

export default function isResponseError(obj: unknown): obj is ResponseError {
    return obj instanceof ResponseError;
}
