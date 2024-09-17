import { createExpressApp } from "@/application/app.js";

async function main() {
  const { env } = await import("@/env.js");
  const app = createExpressApp();

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
