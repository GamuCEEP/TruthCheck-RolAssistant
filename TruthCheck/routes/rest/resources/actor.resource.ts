import { actorCollection } from "root/database/database.ts";
import { oak } from "root/deps.ts";

const router = new oak.Router();

router.get("/actor", (ctx, next) => {
  ctx.response.body = actorCollection.find();
  ctx.response.type = 'json+hal'
});

router.post("/actor", (ctx, next) => {
  const actortest = ctx.request.body().value;
  console.log(actortest);
});

export default router;
