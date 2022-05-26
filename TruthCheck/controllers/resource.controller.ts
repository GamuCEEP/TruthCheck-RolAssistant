import ActorController from "./resources/actor.controller.ts";
import ItemController from "./resources/item.controller.ts";
import StageController from "./resources/stage.controller.ts";
import EffectController from "./resources/effect.controller.ts";
import ActorService from "../services/resources/actor.service.ts";
import ItemService from "../services/resources/item.service.ts";
import StageService from "../services/resources/stage.service.ts";
import EffectService from "../services/resources/effect.service.ts";

import log from "../middlewares/logger.middleware.ts";
import { FetchResourceStructure } from "../types/types.interface.ts";
import { RouterContext } from "../deps.ts";

class ResourceController {
  public static async fetch(
    { request, response }: RouterContext<string>,
  ) {
    const body = request.body();
    const value = await body.value;
    const result: FetchResourceStructure = {};
    log.debug("Getting resources in bulk");
    for (const resourceType in value.bulk) {
      log.debug(`| Getting ${resourceType}`);
      result[resourceType] = [];
      for (const id of value.bulk[resourceType]) {
        log.debug(`| | Getting ${id}`);
        result[resourceType].push(await controllerMap[resourceType].getOne(id));
      }
    }
    response.body = result;
  }
}

const controllerMap: any = {
  actors: ActorService,
  items: ItemService,
  stages: StageService,
  effects: EffectService,
};

export {
  ActorController,
  EffectController,
  ItemController,
  ResourceController,
  StageController,
};
