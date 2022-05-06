const { Client } = require("../../../bundle/dwolla-v2");

async function main() {
    const client = new Client({
        environment: "sandbox",
        key: "[ DWOLLA_SANDBOX_KEY ]",
        secret: "[ DWOLLA_SANDBOX_SECRET ]"
    });

    try {
        const response = await client.get("/");
        console.log("Response Body: ", response.body);
    } catch (err) {
        console.error("Error: ", err);
    }
}

main()
    .catch(err => console.error(err));