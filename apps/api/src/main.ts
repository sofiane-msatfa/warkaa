import { createExpressApp } from "@/application/app.js";
import {connectToMongoDb} from "@/infrastructure/database/database.js";

async function main() {
  const { env } = await import("@/env.js");
  const app = await createExpressApp();

  const connectionResult = await connectToMongoDb(env.MONGODB_URI);

  if (connectionResult.isErr()) {
    console.error(connectionResult.unwrapErr());
    return process.exit(1);
  }

  app
    .listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
