import { Application } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import mainRouter from "./routes/index.routes.ts";
import logger from "./routes/test.routes.ts";

const app = new Application();
const port = "localhost:8000";

// C:\Users\GamuD\.deno\bin\denon :denon route

app.use(logger);

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

app.addEventListener("listen", () => {
  console.log("Running on addres", port);
});

await app.listen(port);
