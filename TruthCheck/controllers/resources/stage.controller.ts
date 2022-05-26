import type { RouterContext } from "../../deps.ts";
import log from "../../middlewares/logger.middleware.ts";
import StageService from "../../services/resources/stage.service.ts";
import { Status } from "../../deps.ts";

class StageController {
  public static async create(
    { request, state, response }: RouterContext<string>,
  ) {
    const body = request.body();
    const {
      name,
      description,
      pasive,
      tags,
      imageURI,
    } = await body.value;
    log.debug("Creating stage");
    response.body = await StageService.createOne({
      author: state.id, //warning: posible rupture, im not sure
      name,
      description,
      pasive,
      tags,
      imageURI,
    });
    response.status = Status.Created;
  }
  public static async fetch(
    { response }: RouterContext<string>,
  ) {
    log.debug("Getting stage list");
    response.body = await StageService.getMany();
  }
  public static async show(
    { params, response }: RouterContext<string>,
  ) {
    const { id } = params;
    log.debug("Getting stage");
    response.body = await StageService.getOne(id as string);
  }
  public static async update(
    { params, request, response, state }: RouterContext<string>,
  ) {
    const { id } = params;
    const body = request.body();
    const {
      name,
      description,
      pasive,
      imageURI,
      tags,
      isShared
    } = await body.value;
    log.debug("Updating stage");
    await StageService.updateOne(id as string, state, {
      name,
      description,
      pasive,
      imageURI,
      tags,
      isShared
    });
    response.body = await StageService.getOne(id as string);
  }
  public static async delete(
    { params, response }: RouterContext<string>,
  ) {
    const { id } = params;
    log.debug("Removing stage");
    const deleteCount = await StageService.removeOne(id as string);
    response.body = { deleted: deleteCount };
  }
}

export default StageController;
