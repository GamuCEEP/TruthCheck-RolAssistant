import { Bson, Status } from "../../deps.ts";
import { throwError } from "../../middlewares/errorHandler.middleware.ts";
import log from "../../middlewares/logger.middleware.ts";
import { Effect, EffectSchema } from "../../models/resources/effect.model.ts";
import type {
  CreateEffectStructure,
  EffectStructure,
  UpdatedStructure,
  UpdateEffectStructure,
} from "../../types/types.interface.ts";

class EffectService {
  public static async createOne(
    options: CreateEffectStructure,
  ) {
    const {
      author,
      name,
      description,
      code,
      imageURI,
      tags,
    } = options;
    const effectExists = await Effect.findOne({ name, author });
    if (effectExists) {
      log.error("Effect already exists");
      return throwError({
        status: Status.Conflict,
        name: "Conflict",
        path: "effect",
        param: "effect",
        message: `Effect already exists`,
        type: "Conflict",
      });
    }
    const createdAt = new Date();
    const effect = await Effect.insertOne({
      author,
      name,
      description,
      code,
      imageURI,
      tags,
      createdAt,
      isShared: false,
      docVersion: 1,
    });
    if (!effect) {
      log.error("Could not create effect");
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "effect",
        param: "effect",
        message: `Could not create effect`,
        type: "BadRequest",
      });
    }
    return effect;
  }
  public static getMany() {
    return Effect.find().toArray();
  }
  public static async getOne(id: string) {
    const effect = await Effect.findOne({ _id: new Bson.ObjectId(id) });
    if (!effect) {
      log.error("Effect not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "effect",
        param: "effect",
        message: `Effect not found`,
        type: "NotFound",
      });
    }
    const {
      author,
      name,
      description,
      code,
      imageURI,
      tags,
    } = effect;

    return {
      id,
      author,
      name,
      description,
      code,
      imageURI,
      tags,
    } as EffectStructure;
  }
  public static async updateOne(
    id: string,
    state: Record<string, string>,
    options: UpdateEffectStructure,
  ) {
    const effect = await Effect.findOne({ _id: new Bson.ObjectId(id) });
    if (!effect) {
      log.error("Effect not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "effect",
        param: "effect",
        message: `Effect not found`,
        type: "NotFound",
      });
    }
    const {
      name,
      description,
      code,
      imageURI,
      tags,
      isShared,
    } = options;
    if (state.id !== effect.author) {
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
      const effectExists = await Effect.findOne(
        {
          name,
          author: effect.author,
          _id: { $ne: effect._id },
        },
      );
      if (effectExists) {
        log.error("Effect already exists");
        return throwError({
          status: Status.Conflict,
          name: "Conflict",
          path: "effect",
          param: "effect",
          message: `Effect already exists`,
          type: "Conflict",
        });
      }
    }
    if (effect.isShared) { //if resource is shared updating it creates a new one
      return this.createOne({
        author: state.id,
        name: name ?? effect.name,
        description: description ?? effect.description,
        code: code ?? effect.code,
        imageURI: imageURI ?? effect.imageURI,
        tags: tags ?? effect.tags,
      });
    }
    const { docVersion } = effect;
    const newDocVersion = docVersion + 1;
    const updatedAt = new Date();
    const result: ({
      upsertedId: any;
      upsertedCount: number;
      matchedCount: number;
      modifiedCount: number;
    }) = await Effect.updateOne({ _id: new Bson.ObjectId(id) }, {
      $set: {
        name,
        description,
        code,
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
        path: "effect",
        param: "effect",
        message: `Could not update effect`,
        type: "BadRequest",
      });
    }
    return result as UpdatedStructure;
  }
  public static async removeOne(id: string) {
    const effect = await Effect.findOne({ _id: new Bson.ObjectId(id) });
    if (!effect) {
      log.error("Effect not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "effect",
        param: "effect",
        message: `Effect not found`,
        type: "NotFound",
      });
    }
    if (effect.isShared) {
      log.error("Effect is shared, cannot be deleted");
      return throwError({
        status: Status.NotFound,
        name: "ResourceShared",
        path: "effect",
        param: "effect",
        message: `Effect is shared`,
        type: "ResourceShared",
      });
    }
    const deleteCount = await Effect.deleteOne({ _id: new Bson.ObjectId(id) });
    if (!deleteCount) {
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "effect",
        param: "effect",
        message: `Could not delete effect`,
        type: "BadRequest",
      });
    }
    return deleteCount;
  }
}

export default EffectService;
