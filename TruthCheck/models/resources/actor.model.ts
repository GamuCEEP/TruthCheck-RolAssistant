import db from "../../db/db.ts";
import { ResourceSchema } from "../resource.model.ts";

export interface ActorSchema extends ResourceSchema {
  stats: Record<string, string>;
  pasive: string[]; //effect id
  active: string[]; //effect id
  inventory: string[]; //item id
  equipment: string[]; //item id
}

export const Actor = db.getDatabase.collection<ActorSchema>("actors");
