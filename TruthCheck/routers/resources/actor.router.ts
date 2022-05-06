import { Router } from "../../deps.ts";
import UserController from "../../controllers/user.controller.ts";
import { auth } from "../../middlewares/auth.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
  createActorValidation,
  updateActorValidation,
  getActorsValidation,
  getActorValidation,
  deleteActorValidation,
} from "../../validations/actor.validation.ts";

// deno-lint-ignore no-explicit-any
const router: any = new Router();