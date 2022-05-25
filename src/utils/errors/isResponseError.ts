import { ResponseError } from "../../errors/ResponseError";

export default function (obj: unknown): obj is ResponseError {
    return obj instanceof ResponseError;
}
