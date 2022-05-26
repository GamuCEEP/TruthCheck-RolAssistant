import type { Application } from "../deps.ts";
import defaultRouter from "./default.router.ts";
import userRouter from "./user.router.ts";
import authRouter from "./auth.router.ts";
import resourceRouter from "./resource.router.ts";
import gameRouter from "./game.router.ts";

const init = (app: Application) => {
  app.use(authRouter.routes());
  app.use(userRouter.routes());
  app.use(gameRouter.routes());
  app.use(resourceRouter.routes());
  app.use(defaultRouter.routes());

  app.use(authRouter.allowedMethods());
  app.use(userRouter.allowedMethods());
  app.use(gameRouter.allowedMethods());
  app.use(resourceRouter.allowedMethods());
  app.use(defaultRouter.allowedMethods());
};

export default {
  init,
};
