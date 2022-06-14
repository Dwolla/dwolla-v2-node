import { DwollaError } from "../../errors";

export default function isDwollaError(obj: unknown): obj is DwollaError {
    return obj instanceof DwollaError;
}
