import { version } from "../../package.json";

export default function userAgent(): string {
    return ["dwolla-v2-node", version].join(" ");
}
