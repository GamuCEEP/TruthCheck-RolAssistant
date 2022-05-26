import { Bson, Status } from "../../deps.ts";
import { throwError } from "../../middlewares/errorHandler.middleware.ts";
import log from "../../middlewares/logger.middleware.ts";
import { Actor, ActorSchema } from "../../models/resources/actor.model.ts";
import { toForeignKeys } from "../../helpers/foreignKey.helper.ts";
import type {
  ActorStructure,
  CreateActorStructure,
  UpdateActorStructure,
  UpdatedStructure,
} from "../../types/types.interface.ts";

class ActorService {
  public static async createOne(
    options: CreateActorStructure,
  ) {
    const {
      author,
      name,
      description,
      stats,
      active,
      pasive,
      inventory,
      equipment,
      imageURI,
      tags,
    } = options;
    const actorExists = await Actor.findOne({ name, author });
    if (actorExists) {
      log.error("Actor already exists");
      return throwError({
        status: Status.Conflict,
        name: "Conflict",
        path: "actor",
        param: "actor",
        message: `Actor already exists`,
        type: "Conflict",
      });
    }
    const createdAt = new Date();
    const actor = await Actor.insertOne({
      author,
      name,
      description,
      stats,
      active,
      pasive,
      inventory,
      equipment,
      imageURI,
      tags,
      createdAt,
      isShared: false,
      docVersion: 1,
    });
    if (!actor) {
      log.error("Could not create actor");
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "actor",
        param: "actor",
        message: `Could not create actor`,
        type: "BadRequest",
      });
    }
    return actor;
  }
  public static getMany() {
    return Actor.find().toArray();
  }
  public static async getOne(id: string) {
    const actor = await Actor.findOne({ _id: new Bson.ObjectId(id) });
    if (!actor) {
      log.error("Actor not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "actor",
        param: "actor",
        message: `Actor not found`,
        type: "NotFound",
      });
    }
    const {
      author,
      name,
      description,
      stats,
      active,
      pasive,
      inventory,
      equipment,
      imageURI,
      tags,
    } = actor;

    return {
      id,
      author,
      name,
      description,
      stats,
      active: toForeignKeys("effects", active),
      pasive: toForeignKeys("effects", pasive),
      inventory: toForeignKeys("items", inventory),
      equipment: toForeignKeys("items", equipment),
      imageURI,
      tags,
    } as ActorStructure;
  }
  public static async updateOne(
    id: string,
    state: Record<string, string>,
    options: UpdateActorStructure,
  ) {
    const actor = await Actor.findOne({ _id: new Bson.ObjectId(id) });
    if (!actor) {
      log.error("Actor not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "actor",
        param: "actor",
        message: `Actor not found`,
        type: "NotFound",
      });
    }
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
    } = options;
    if (state.id !== actor.author) {
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
      const actorExists = await Actor.findOne(
        {
          name,
          author: actor.author,
          _id: { $ne: actor._id },
        },
      );
      if (actorExists) {
        log.error("Actor already exists");
        return throwError({
          status: Status.Conflict,
          name: "Conflict",
          path: "actor",
          param: "actor",
          message: `Actor already exists`,
          type: "Conflict",
        });
      }
    }
    if (actor.isShared) { //if resource is shared updating it creates a new one
      return this.createOne({
        author: state.id,
        name: name ?? actor.name,
        description: description ?? actor.description,
        stats: stats ?? actor.stats,
        active: active ?? actor.active,
        pasive: pasive ?? actor.pasive,
        inventory: inventory ?? actor.inventory,
        equipment: equipment ?? actor.equipment,
        imageURI: imageURI ?? actor.imageURI,
        tags: tags ?? actor.tags,
      });
    }
    const { docVersion } = actor;
    const newDocVersion = docVersion + 1;
    const updatedAt = new Date();
    const result: ({
      upsertedId: any;
      upsertedCount: number;
      matchedCount: number;
      modifiedCount: number;
    }) = await Actor.updateOne({ _id: new Bson.ObjectId(id) }, {
      $set: {
        name,
        description,
        stats,
        active,
        pasive,
        inventory,
        equipment,
        imageURI,
        tags,
        docVersion: newDocVersion,
        updatedAt,
        isShared,
      },
    });
    if (!result) {
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "actor",
        param: "actor",
        message: `Could not update actor`,
        type: "BadRequest",
      });
    }
    return result as UpdatedStructure;
  }
  public static async removeOne(id: string) {
    const actor = await Actor.findOne({ _id: new Bson.ObjectId(id) });
    if (!actor) {
      log.error("Actor not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "actor",
        param: "actor",
        message: `Actor not found`,
        type: "NotFound",
      });
    }
    if (actor.isShared) {
      log.error("Actor is shared, cannot be deleted");
      return throwError({
        status: Status.NotFound,
        name: "ResourceShared",
        path: "actor",
        param: "actor",
        message: `Actor is shared`,
        type: "ResourceShared",
      });
    }
    const deleteCount = await Actor.deleteOne({ _id: new Bson.ObjectId(id) });
    if (!deleteCount) {
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "actor",
        param: "actor",
        message: `Could not delete actor`,
        type: "BadRequest",
      });
    }
    return deleteCount;
  }
}

export default ActorService;
