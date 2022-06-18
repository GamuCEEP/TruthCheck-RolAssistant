import type { RouterContext } from "../../deps.ts";
import log from "../../middlewares/logger.middleware.ts";
import ItemService from "../../services/resources/item.service.ts";
import { Status } from "../../deps.ts";

class ItemController {
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
      tags,
      imageURI,
    } = await body.value;
    log.debug("Creating item");
    response.body = await ItemService.createOne({
      author: state.id,
      name,
      description,
      stats,
      pasive,
      active,
      tags,
      imageURI,
    });
    response.status = Status.Created;
  }
  public static async fetch(
    { response }: RouterContext<string>,
  ) {
    log.debug("Getting item list");
    response.body = await ItemService.getMany();
  }
  public static async show(
    { params, response }: RouterContext<string>,
  ) {
    const { id } = params;
    log.debug("Getting item");
    response.body = await ItemService.getOne(id as string);
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
      imageURI,
      tags,
      isShared
    } = await body.value;
    log.debug("Updating item");
    await ItemService.updateOne(id as string, state, {
      name,
      description,
      stats,
      active,
      pasive,
      imageURI,
      tags,
      isShared
    });
    response.body = await ItemService.getOne(id as string);
  }
  public static async delete(
    { params, response }: RouterContext<string>,
  ) {
    const { id } = params;
    log.debug("Removing item");
    const deleteCount = await ItemService.removeOne(id as string);
    response.body = { deleted: deleteCount };
  }
}

export default ItemController;
