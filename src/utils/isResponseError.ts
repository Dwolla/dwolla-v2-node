import { ResponseError } from "../errors/ResponseError";

export default function (obj: any): obj is ResponseError {
    return obj instanceof ResponseError;
}
