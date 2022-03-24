import { oak, oauth } from '/dependencies.ts';
import { router } from '/routes/routes.ts'

const port = 8000;

const app = new oak.Application();
const dashport = new oauth.DashportOak(app);

// TODO continue setting up dashport :)

app.use(router.routes())
app.use(router.allowedMethods())


app.addEventListener("listen", () => {
  console.log("Running on address", port);
});

await app.listen({ port: port });
