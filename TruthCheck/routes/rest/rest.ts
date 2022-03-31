import { oak } from "root/deps.ts";

import ActorRestRouter from "./resources/actor.resource.ts";
import StageRestRouter from "./resources/stage.resource.ts";
import ItemRestRouter from "./resources/item.resource.ts";
import EffectRestRouter from "./resources/effect.resource.ts";

const routers = [
  ActorRestRouter,
  StageRestRouter,
  ItemRestRouter,
  EffectRestRouter,
];

const restRouter = new oak.Router();

for (const router of routers) {
  restRouter.use(router.routes());
  restRouter.use(router.allowedMethods());
}

export { restRouter };