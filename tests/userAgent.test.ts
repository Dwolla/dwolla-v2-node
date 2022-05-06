import { version } from "../package.json";
import { userAgent } from "../src/utils";

describe("userAgent", function () {
    it("should include current package version", () => {
        const agentStr: string = ["dwolla-v2-node", version].join(" ");
        expect(userAgent()).toEqual(agentStr);
    });
});
