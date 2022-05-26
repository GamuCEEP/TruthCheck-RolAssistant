import db from "../../db/db.ts";
import { ResourceSchema } from "../resource.model.ts";

export interface StageSchema extends ResourceSchema {
  pasive: string[]; //effect id
}

export const Stage = db.getDatabase.collection<StageSchema>("stages");
