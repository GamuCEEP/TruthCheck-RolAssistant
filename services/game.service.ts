import { Bson, Status } from "../deps.ts";
import { throwError } from "../middlewares/errorHandler.middleware.ts";
import log from "../middlewares/logger.middleware.ts";
import { Game, GameSchema } from "../models/game.model.ts";
import { toForeignKeys } from "../helpers/foreignKey.helper.ts";
import type {
  CreateGameStructure,
  GameStructure,
  UpdatedStructure,
  UpdateGameStructure,
} from "../types/types.interface.ts";

class GameService {
  public static async createOne(
    options: CreateGameStructure,
  ) {
    const {
      author,
      name,
      description,
      actors,
      stages,
    } = options;
    const gameExists = await Game.findOne({ name, author });
    if (gameExists) {
      log.error("Game already exists");
      return throwError({
        status: Status.Conflict,
        name: "Conflict",
        path: "game",
        param: "game",
        message: `Game already exists`,
        type: "Conflict",
      });
    }
    const createdAt = new Date();
    const game = await Game.insertOne({
      author,
      name,
      description,
      docVersion: 1,
      isShared: false,
      createdAt,
      actors,
      stages,
    });
    if (!game) {
      log.error("Could not create game");
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "game",
        param: "game",
        message: `Could not create game`,
        type: "BadRequest",
      });
    }
  }
  public static getMany() {
    return Game.find().toArray();
  }
  public static async getOne(id: string) {
    const game = await Game.findOne({ _id: new Bson.ObjectId(id) });
    if (!game) {
      log.error("Game not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "game",
        param: "game",
        message: `Game not found`,
        type: "NotFound",
      });
    }
    const {
      author,
      name,
      description,
      isShared,
      createdAt,
      updatedAt,
      actors,
      stages,
    } = game;

    return {
      id,
      author,
      name,
      description,
      isShared,
      createdAt,
      updatedAt,
      actors: toForeignKeys("actors", actors),
      stages: stages.map((stage) => {
        return {
          stage: toForeignKeys("stages", [stage.stage])[0],
          deck: stage.deck.map((card) => {
            return {
              odds: card.odds,
              resource: card.resource,
              condition: card.condition,
            };
          }),
        };
      }),
    } as GameStructure;
  }
  public static async updateOne(
    id: string,
    state: Record<string, string>,
    options: UpdateGameStructure,
  ) {
    const game = await Game.findOne({ _id: new Bson.ObjectId(id) });
    if (!game) {
      log.error("Game not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "game",
        param: "game",
        message: `Game not found`,
        type: "NotFound",
      });
    }
    const {
      name,
      description,
      isShared,
      actors,
      stages
    } = options;
    if (state.id !== game.author) {
      return throwError({
        status: Status.Forbidden,
        name: "Forbidden",
        path: `access_token`,
        param: `access_token`,
        message: `Insufficient rights`,
        type: "Forbidden",
      });
    }
    if (name) {
      const gameExists = await Game.findOne(
        {
          name,
          author: game.author,
          _id: { $ne: game._id },
        },
      );
      if (gameExists) {
        log.error("Game already exists");
        return throwError({
          status: Status.Conflict,
          name: "Conflict",
          path: "game",
          param: "game",
          message: `Game already exists`,
          type: "Conflict",
        });
      }
    }

    if (game.isShared) { //if resource is shared updating it creates a new one
      return this.createOne({
        author: state.id,
        name: name ?? game.name,
        description: description ?? game.description,
        actors: actors ?? game.actors,
        stages: defineStage(stages) ?? game.stages
      });

    }
    const { docVersion } = game;
    const newDocVersion = docVersion + 1;
    const updatedAt = new Date();
    const result: ({
      upsertedId: any;
      upsertedCount: number;
      matchedCount: number;
      modifiedCount: number;
    }) = await Game.updateOne({ _id: new Bson.ObjectId(id) }, {
      $set: {
        name,
        description,
        docVersion: newDocVersion,
        isShared,
        updatedAt,
        actors,
        stages: defineStage(stages)
      },
    });
    if (!result) {
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "game",
        param: "game",
        message: `Could not update game`,
        type: "BadRequest",
      });
    }
    return result as UpdatedStructure;
  }
  public static async removeOne(id: string) {
    const game = await Game.findOne({ _id: new Bson.ObjectId(id) });
    if (!game) {
      log.error("Game not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "game",
        param: "game",
        message: `Game not found`,
        type: "NotFound",
      });
    }
    if (game.isShared) {
      log.error("Game is shared, cannot be deleted");
      return throwError({
        status: Status.NotFound,
        name: "ResourceShared",
        path: "game",
        param: "game",
        message: `Game is shared`,
        type: "ResourceShared",
      });
    }
    const deleteCount = await Game.deleteOne({ _id: new Bson.ObjectId(id) });
    if (!deleteCount) {
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "game",
        param: "game",
        message: `Could not delete game`,
        type: "BadRequest",
      });
    }
    return deleteCount;
  }
}

function defineStage(stages: UpdateGameStructure['stages']){
  return stages?.map(stage=>{
    return {
      stage: stage.stage,
      deck: stage.deck?.map(deck=>{
        return {
          odds: deck.odds!,
          resource: deck.resource,
          condition: deck.condition
        }
      })!
    }
  })
}

export default GameService;
