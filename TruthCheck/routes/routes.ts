import { oak } from "root/deps.ts";
import { restRouter } from "./rest/rest.ts";

const router = new oak.Router();

router.use(restRouter.routes());
router.use(restRouter.allowedMethods());

router.get("/test", (ctx, next) => {
  console.log("request to test");
});

export { router };
