import type { RouterContext } from "../../deps.ts";
import log from "../../middlewares/logger.middleware.ts";
import EffectService from "../../services/resources/effect.service.ts";
import { Status } from "../../deps.ts";

class EffectController {
  public static async create(
    { request, state, response }: RouterContext<string>,
  ) {
    const body = request.body();
    const {
      name,
      description,
      code,
      tags,
      imageURI,
    } = await body.value;
    log.debug("Creating effect");
    response.body = await EffectService.createOne({
      author: state.id, //warning: posible rupture, im not sure
      name,
      description,
      code,
      tags,
      imageURI,
    });
    response.status = Status.Created;
  }
  public static async fetch(
    { response }: RouterContext<string>,
  ) {
    log.debug("Getting effect list");
    response.body = await EffectService.getMany();
  }
  public static async show(
    { params, response }: RouterContext<string>,
  ) {
    const { id } = params;
    log.debug("Getting effect");
    response.body = await EffectService.getOne(id as string);
  }
  public static async update(
    { params, request, response, state }: RouterContext<string>,
  ) {
    const { id } = params;
    const body = request.body();
    const {
      name,
      description,
      code,
      imageURI,
      tags,
      isShared
    } = await body.value;
    log.debug("Updating effect");
    await EffectService.updateOne(id as string, state, {
      name,
      description,
      code,
      imageURI,
      tags,
      isShared
    });
    response.body = await EffectService.getOne(id as string);
  }
  public static async delete(
    { params, response }: RouterContext<string>,
  ) {
    const { id } = params;
    log.debug("Removing effect");
    const deleteCount = await EffectService.removeOne(id as string);
    response.body = { deleted: deleteCount };
  }
}

export default EffectController;
