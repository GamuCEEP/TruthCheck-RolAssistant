import { Bson, Status } from "../../deps.ts";
import { throwError } from "../../middlewares/errorHandler.middleware.ts";
import log from "../../middlewares/logger.middleware.ts";
import { Stage, StageSchema } from "../../models/resources/stage.model.ts";
import { toForeignKeys } from "../../helpers/foreignKey.helper.ts";
import type {
  CreateStageStructure,
  StageStructure,
  UpdatedStructure,
  UpdateStageStructure,
} from "../../types/types.interface.ts";

class StageService {
  public static async createOne(
    options: CreateStageStructure,
  ) {
    const {
      author,
      name,
      description,
      pasive,
      imageURI,
      tags,
    } = options;
    const stageExists = await Stage.findOne({ name, author });
    if (stageExists) {
      log.error("Stage already exists");
      return throwError({
        status: Status.Conflict,
        name: "Conflict",
        path: "stage",
        param: "stage",
        message: `Stage already exists`,
        type: "Conflict",
      });
    }
    const createdAt = new Date();
    const stage = await Stage.insertOne({
      author,
      name,
      description,
      pasive,
      imageURI,
      tags,
      createdAt,
      isShared: false,
      docVersion: 1,
    });
    if (!stage) {
      log.error("Could not create stage");
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "stage",
        param: "stage",
        message: `Could not create stage`,
        type: "BadRequest",
      });
    }
    return stage;
  }
  public static getMany() {
    return Stage.find().toArray();
  }
  public static async getOne(id: string) {
    const stage = await Stage.findOne({ _id: new Bson.ObjectId(id) });
    if (!stage) {
      log.error("Stage not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "stage",
        param: "stage",
        message: `Stage not found`,
        type: "NotFound",
      });
    }
    const {
      author,
      name,
      description,
      pasive,
      imageURI,
      tags,
    } = stage;

    return {
      id,
      author,
      name,
      description,
      pasive: toForeignKeys("effects", pasive),
      imageURI,
      tags,
    } as StageStructure;
  }
  public static async updateOne(
    id: string,
    state: Record<string, string>,
    options: UpdateStageStructure,
  ) {
    const stage = await Stage.findOne({ _id: new Bson.ObjectId(id) });
    if (!stage) {
      log.error("Stage not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "stage",
        param: "stage",
        message: `Stage not found`,
        type: "NotFound",
      });
    }
    const {
      name,
      description,
      pasive,
      imageURI,
      tags,
      isShared,
    } = options;
    if (state.id !== stage.author) {
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
      const stageExists = await Stage.findOne(
        {
          name,
          author: stage.author,
          _id: { $ne: stage._id },
        },
      );
      if (stageExists) {
        log.error("Stage already exists");
        return throwError({
          status: Status.Conflict,
          name: "Conflict",
          path: "stage",
          param: "stage",
          message: `Stage already exists`,
          type: "Conflict",
        });
      }
    }
    if (stage.isShared) { //if resource is shared updating it creates a new one
      return this.createOne({
        author: state.id,
        name: name ?? stage.name,
        description: description ?? stage.description,
        pasive: pasive ?? stage.pasive,
        imageURI: imageURI ?? stage.imageURI,
        tags: tags ?? stage.tags,
      });
    }
    const { docVersion } = stage;
    const newDocVersion = docVersion + 1;
    const updatedAt = new Date();
    const result: ({
      upsertedId: any;
      upsertedCount: number;
      matchedCount: number;
      modifiedCount: number;
    }) = await Stage.updateOne({ _id: new Bson.ObjectId(id) }, {
      $set: {
        name,
        description,
        pasive,
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
        path: "stage",
        param: "stage",
        message: `Could not update stage`,
        type: "BadRequest",
      });
    }
    return result as UpdatedStructure;
  }
  public static async removeOne(id: string) {
    const stage = await Stage.findOne({ _id: new Bson.ObjectId(id) });
    if (!stage) {
      log.error("Stage not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "stage",
        param: "stage",
        message: `Stage not found`,
        type: "NotFound",
      });
    }
    if (stage.isShared) {
      log.error("Stage is shared, cannot be deleted");
      return throwError({
        status: Status.NotFound,
        name: "ResourceShared",
        path: "stage",
        param: "stage",
        message: `Stage is shared`,
        type: "ResourceShared",
      });
    }
    const deleteCount = await Stage.deleteOne({ _id: new Bson.ObjectId(id) });
    if (!deleteCount) {
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "stage",
        param: "stage",
        message: `Could not delete stage`,
        type: "BadRequest",
      });
    }
    return deleteCount;
  }
}

export default StageService;
