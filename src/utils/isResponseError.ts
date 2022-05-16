import { ResponseError } from "../response-error";

export default function (obj: any): obj is ResponseError {
    return obj instanceof ResponseError;
}
