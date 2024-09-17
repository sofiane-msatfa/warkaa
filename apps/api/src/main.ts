import {createExpressApp} from "@/application/app.js";
import {connectToMongoDb} from "@/infrastructure/database/database.js";

async function main() {
    const {env} = await import("./env.js");
    const app = createExpressApp();

    await connectToMongoDb(env.MONGODB_URI, {});

    app.listen(env.PORT, () => {
        console.log(`Example app listening on port ${env.PORT}`)
    })
}

await main()