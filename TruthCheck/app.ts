import { oak } from "./dependencies.ts";
import mainRouter from "./routes/index.routes.ts";
import logger from "./routes/test.routes.ts";

const app = new oak.Application();
const port = "localhost:8000";



app.use(logger);

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

app.addEventListener("listen", () => {
  console.log("Running on addres", port);
});

await app.listen(port);
