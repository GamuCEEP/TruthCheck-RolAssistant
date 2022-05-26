import type { RouterContext } from "../../deps.ts";
import log from "../../middlewares/logger.middleware.ts";
import ActorService from "../../services/resources/actor.service.ts";
import { Status } from "../../deps.ts";

class ActorController {
  public static async create(
    { request, state, response }: RouterContext<string>,
  ) {
    const body = request.body();
    const {
      name,
      description,
      stats,
      pasive,
      active,
      inventory,
      equipment,
      tags,
      imageURI,
    } = await body.value;
    log.debug("Creating actor");
    response.body = await ActorService.createOne({
      author: state.id, //warning: posible rupture, im not sure
      name,
      description,
      stats,
      pasive,
      active,
      inventory,
      equipment,
      tags,
      imageURI,
    });
    response.status = Status.Created;
  }
  public static async fetch(
    { response }: RouterContext<string>,
  ) {
    log.debug("Getting actor list");
    response.body = await ActorService.getMany();
  }
  public static async show(
    { params, response }: RouterContext<string>,
  ) {
    const { id } = params;
    log.debug("Getting actor");
    response.body = await ActorService.getOne(id as string);
  }
  public static async update(
    { params, request, response, state }: RouterContext<string>,
  ) {
    const { id } = params;
    const body = request.body();
    const {
      name,
      description,
      stats,
      active,
      pasive,
      inventory,
      equipment,
      imageURI,
      tags,
      isShared,
    } = await body.value;
    log.debug("Updating actor");
    await ActorService.updateOne(id as string, state, {
      name,
      description,
      stats,
      active,
      pasive,
      inventory,
      equipment,
      imageURI,
      tags,
      isShared,
    });

    response.body = await ActorService.getOne(id as string);
  }
  public static async delete(
    { params, response }: RouterContext<string>,
  ) {
    const { id } = params;
    log.debug("Removing actor");
    const deleteCount = await ActorService.removeOne(id as string);
    response.body = { deleted: deleteCount };
  }
}

export default ActorController;
