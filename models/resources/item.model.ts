import db from "../../db/db.ts";
import { ResourceSchema } from "../resource.model.ts";

export interface ItemSchema extends ResourceSchema {
  stats: Record<string, string>;
  pasive: string[]; //effect id
  active: string[]; //effect id
}

export const Item = db.getDatabase.collection<ItemSchema>("items");
