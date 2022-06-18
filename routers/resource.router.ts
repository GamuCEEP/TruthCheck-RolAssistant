import { Router, RouterContext } from "../deps.ts";
import { ResourceController } from "../controllers/resource.controller.ts";
import { ActorController } from "../controllers/resource.controller.ts";
import { StageController } from "../controllers/resource.controller.ts";
import { ItemController } from "../controllers/resource.controller.ts";
import { EffectController } from "../controllers/resource.controller.ts";
import { auth } from "../middlewares/auth.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
// import { preUploadValidate, upload } from "../deps.ts";
import {
  createActorValidation,
  createEffectValidation,
  createItemValidation,
  createStageValidation,
  deleteResourceValidation,
  fetchResourcesValidation,
  getResourcesValidation,
  getResourceValidation,
  updateActorValidation,
  updateEffectValidation,
  updateItemValidation,
  updateStageValidation,
} from "../validations/resource.validation.ts";

// deno-lint-ignore no-explicit-any
const router: any = new Router();

router.post(
  "/api/resources",
  validate(fetchResourcesValidation),
  ResourceController.fetch,
);
// router.post(
//   "/api/image",
//   upload("public/images", {
//     extensions: ["jpg", "png"],
//     maxSizeBytes: 20000000,
//     maxFileSizeBytes: 10000000,
//   }),
//   (context: any) => {
//     context.response.body = context.uploadedFiles;
//   },
// );
// router.post(
//   "/api/image-test",
//   preUploadValidate(
//     ["jpg", "png"],
//     20000000,
//     10000000,
//   ),
//   ({ response }: RouterContext<string>) => {
//     response.body = { validUpload: true };
//   },
// );

/*
 To edit a resource:
  -client must be the author
  -if resource is shared it is not updated, copy is created an updated instead
    -resources have a version number
    -to test if the resource already exists name, version and author are tested
    -when the version 2 of a resource is shared version 1 no longer is visible
      -is only visible for clients with it on their libraries
 */

//#region ___Actors___
//Create a new actor
router.post(
  "/api/resources/actors",
  auth(["manageResources"]),
  validate(createActorValidation),
  ActorController.create,
);
//Get all actors
router.get(
  "/api/resources/actors",
  auth(["manageResources"]),
  validate(getResourcesValidation),
  ActorController.fetch,
);
//Get a specific actor
router.get(
  "/api/resources/actors/:id",
  auth(["manageResources"]),
  validate(getResourceValidation),
  ActorController.show,
);
//Edit a specific actor
router.put(
  "/api/resources/actors/:id",
  auth(["manageResources"]),
  validate(updateActorValidation),
  ActorController.update,
);
//Delete a specific actor
router.delete(
  "/api/resources/actors/:id",
  auth(["manageResources"]),
  validate(deleteResourceValidation),
  ActorController.delete,
);
//#endregion

//#region ___Items___
//Create new item
router.post(
  "/api/resources/items",
  auth(["manageResources"]),
  validate(createItemValidation),
  ItemController.create,
);
//Get all item
router.get(
  "/api/resources/items",
  auth(["manageResources"]),
  validate(getResourcesValidation),
  ItemController.fetch,
);
//Get a specific item
router.get(
  "/api/resources/items/:id",
  auth(["manageResources"]),
  validate(getResourceValidation),
  ItemController.show,
);
//Update a specific item
router.put(
  "/api/resources/items/:id",
  auth(["manageResources"]),
  validate(updateItemValidation),
  ItemController.update,
);
//Delete a specific item
router.delete(
  "/api/resources/items/:id",
  auth(["manageResources"]),
  validate(deleteResourceValidation),
  ItemController.delete,
);
//#endregion

//#region ___Stages___
//Create a new stage
router.post(
  "/api/resources/stages",
  auth(["manageResources"]),
  validate(createStageValidation),
  StageController.create,
);
//Get all stages
router.get(
  "/api/resources/stages",
  auth(["manageResources"]),
  validate(getResourcesValidation),
  StageController.fetch,
);
//Get a specific stage
router.get(
  "/api/resources/stages/:id",
  auth(["manageResources"]),
  validate(getResourceValidation),
  StageController.show,
);
//Edit a specific stage
router.put(
  "/api/resources/stages/:id",
  auth(["manageResources"]),
  validate(updateStageValidation),
  StageController.update,
);
//Delete a specific stage
router.delete(
  "/api/resources/stages/:id",
  auth(["manageResources"]),
  validate(deleteResourceValidation),
  StageController.delete,
);
//#endregion

//#region ___Effects___
//Create a new effect
router.post(
  "/api/resources/effects",
  auth(["manageResources"]),
  validate(createEffectValidation),
  EffectController.create,
);
//Get all effects
router.get(
  "/api/resources/effects",
  auth(["manageResources"]),
  validate(getResourcesValidation),
  EffectController.fetch,
);
//Get a specific effect
router.get(
  "/api/resources/effects/:id",
  auth(["manageResources"]),
  validate(getResourceValidation),
  EffectController.show,
);
//Update a specific effect
router.put(
  "/api/resources/effects/:id",
  auth(["manageResources"]),
  validate(updateEffectValidation),
  EffectController.update,
);
//Delete a specific effect
router.delete(
  "/api/resources/effects/:id",
  auth(["manageResources"]),
  validate(deleteResourceValidation),
  EffectController.delete,
);
//#endregion

export default router;
