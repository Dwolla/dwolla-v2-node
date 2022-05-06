import { version } from "../../package.json";

export default function (): string {
    return ["dwolla-v2-node", version].join(" ");
}
