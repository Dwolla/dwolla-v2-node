import { Stream } from "node:stream";
import FormData from "form-data";

function isStream(stream: unknown): stream is Stream {
    return stream !== null && typeof stream === "object" && typeof (stream as Stream).pipe === "function";
}

export default function isFormData(obj: unknown): obj is FormData {
    return isStream(obj) && typeof (obj as FormData).getBoundary === "function";
}
