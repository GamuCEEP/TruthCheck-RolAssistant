import { Bson, Status } from "../../deps.ts";
import { throwError } from "../../middlewares/errorHandler.middleware.ts";
import log from "../../middlewares/logger.middleware.ts";
import { Item, ItemSchema } from "../../models/resources/item.model.ts";
import { toForeignKeys } from "../../helpers/foreignKey.helper.ts";
import type {
  CreateItemStructure,
  ItemStructure,
  UpdatedStructure,
  UpdateItemStructure,
} from "../../types/types.interface.ts";

class ItemService {
  public static async createOne(
    options: CreateItemStructure,
  ) {
    const {
      author,
      name,
      description,
      stats,
      active,
      pasive,
      imageURI,
      tags,
    } = options;
    const itemExists = await Item.findOne({ name, author });
    if (itemExists) {
      log.error("Item already exists");
      return throwError({
        status: Status.Conflict,
        name: "Conflict",
        path: "item",
        param: "item",
        message: `Item already exists`,
        type: "Conflict",
      });
    }
    const createdAt = new Date();
    const item = await Item.insertOne({
      author,
      name,
      description,
      stats,
      active,
      pasive,
      imageURI,
      tags,
      createdAt,
      isShared: false,
      docVersion: 1,
    });
    if (!item) {
      log.error("Could not create item");
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "item",
        param: "item",
        message: `Could not create item`,
        type: "BadRequest",
      });
    }
    return item;
  }
  public static getMany() {
    return Item.find().toArray();
  }
  public static async getOne(id: string) {
    const item = await Item.findOne({ _id: new Bson.ObjectId(id) });
    if (!item) {
      log.error("Item not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "item",
        param: "item",
        message: `Item not found`,
        type: "NotFound",
      });
    }
    const {
      author,
      name,
      description,
      active,
      pasive,
      imageURI,
      tags,
    } = item;

    return {
      id,
      author,
      name,
      description,
      active: toForeignKeys("effects", active),
      pasive: toForeignKeys("effects", pasive),
      imageURI,
      tags,
    } as ItemStructure;
  }
  public static async updateOne(
    id: string,
    state: Record<string, string>,
    options: UpdateItemStructure,
  ) {
    const item = await Item.findOne({ _id: new Bson.ObjectId(id) });
    if (!item) {
      log.error("Item not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "item",
        param: "item",
        message: `Item not found`,
        type: "NotFound",
      });
    }
    const {
      name,
      description,
      stats,
      active,
      pasive,
      imageURI,
      tags,
      isShared,
    } = options;
    if (state.id !== item.author) {
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
      const itemExists = await Item.findOne(
        {
          name,
          author: item.author,
          _id: { $ne: item._id },
        },
      );
      if (itemExists) {
        log.error("Item already exists");
        return throwError({
          status: Status.Conflict,
          name: "Conflict",
          path: "item",
          param: "item",
          message: `Item already exists`,
          type: "Conflict",
        });
      }
    }
    if (item.isShared) { //if resource is shared updating it creates a new one
      return this.createOne({
        author: state.id,
        name: name ?? item.name,
        stats: stats ?? item.stats,
        description: description ?? item.description,
        active: active ?? item.active,
        pasive: pasive ?? item.pasive,
        imageURI: imageURI ?? item.imageURI,
        tags: tags ?? item.tags,
      });
    }
    const { docVersion } = item;
    const newDocVersion = docVersion + 1;
    const updatedAt = new Date();
    const result: ({
      upsertedId: any;
      upsertedCount: number;
      matchedCount: number;
      modifiedCount: number;
    }) = await Item.updateOne({ _id: new Bson.ObjectId(id) }, {
      $set: {
        name,
        description,
        active,
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
        path: "item",
        param: "item",
        message: `Could not update item`,
        type: "BadRequest",
      });
    }
    return result as UpdatedStructure;
  }
  public static async removeOne(id: string) {
    const item = await Item.findOne({ _id: new Bson.ObjectId(id) });
    if (!item) {
      log.error("Item not found");
      return throwError({
        status: Status.NotFound,
        name: "NotFound",
        path: "item",
        param: "item",
        message: `Item not found`,
        type: "NotFound",
      });
    }
    if (item.isShared) {
      log.error("Item is shared, cannot be deleted");
      return throwError({
        status: Status.NotFound,
        name: "ResourceShared",
        path: "item",
        param: "item",
        message: `Item is shared`,
        type: "ResourceShared",
      });
    }
    const deleteCount = await Item.deleteOne({ _id: new Bson.ObjectId(id) });
    if (!deleteCount) {
      return throwError({
        status: Status.BadRequest,
        name: "BadRequest",
        path: "item",
        param: "item",
        message: `Could not delete item`,
        type: "BadRequest",
      });
    }
    return deleteCount;
  }
}

export default ItemService;
