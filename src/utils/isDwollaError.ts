import { DwollaError } from "../errors/DwollaError";

export default function (obj: any): obj is DwollaError {
    return obj instanceof DwollaError;
}
