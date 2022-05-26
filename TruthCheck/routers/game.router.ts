import { Router } from "../deps.ts";
import GameController from "../controllers/game.controller.ts";
import { auth } from "../middlewares/auth.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  createGameValidation,
  updateGameValidation,
} from "../validations/game.validation.ts";
import {
  getResourcesValidation,
  getResourceValidation,
  deleteResourceValidation,
} from "../validations/resource.validation.ts";
// deno-lint-ignore no-explicit-any
const router: any = new Router();

router.post(
  "/api/game",
  auth(["manageResources"]),
  validate(createGameValidation),
  GameController.create,
);

router.get(
  "/api/game",
  auth(["manageResources"]),
  validate(getResourcesValidation),
  GameController.fetch
);

router.get(
  "/api/game/:id",
  auth(["manageResources"]),
  validate(getResourceValidation),
  GameController.show
);

router.put(
  "/api/game/:id",
  auth(["manageResources"]),
  validate(updateGameValidation),
  GameController.update
);

router.delete(
  "/api/game/:id",
  auth(["manageResources"]),
  validate(deleteResourceValidation),
  GameController.delete
);

export default router;
