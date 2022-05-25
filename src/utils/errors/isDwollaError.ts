import { DwollaError } from "../../errors/DwollaError";

export default function (obj: unknown): obj is DwollaError {
    return obj instanceof DwollaError;
}
