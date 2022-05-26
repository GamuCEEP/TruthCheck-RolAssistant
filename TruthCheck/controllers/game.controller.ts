import type { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import GameService from "../services/game.service.ts";
import { Status } from "../deps.ts";

class GameController {
  public static async create(
    { request, state, response }: RouterContext<string>,
  ) {
    const body = request.body();
    const {
      name,
      description,
      imageURI,
      actors,
      stages,
    } = await body.value;
    log.debug("Creating game");
    response.body = await GameService.createOne({
      author: state.id,
      name,
      description,
      imageURI,
      actors,
      stages,
    });
    response.status = Status.Created;
  }
  public static async fetch(
    { response }: RouterContext<string>,
  ) {
    log.debug("Getting game list");
    response.body = await GameService.getMany();
  }
  public static async show(
    { params, response }: RouterContext<string>,
  ) {
    const { id } = params;
    log.debug("Getting game");
    response.body = await GameService.getOne(id as string);
  }
  public static async update(
    { params, request, response, state }: RouterContext<string>,
  ) {
    const { id } = params;
    const body = request.body();
    const {
      name,
      description,
      imageURI,
      isShared,
      actors,
      stages,
    } = await body.value;
    log.debug("Updating game");
    await GameService.updateOne(id as string, state, {
      name,
      description,
      imageURI,
      isShared,
      actors,
      stages,
    });
    response.body = await GameService.getOne(id as string);
  }
  public static async delete(
    { params, response }: RouterContext<string>,
  ) {
    const { id } = params;
    log.debug("Removing game");
    const deleteCount = await GameService.removeOne(id as string);
    response.body = { deleted: deleteCount };
  }
}

export default GameController;
