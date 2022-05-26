import db from "../../db/db.ts";
import { ForeignKey } from "../../types/types.interface.ts";
import { ResourceSchema } from "../resource.model.ts";

export interface EffectSchema extends ResourceSchema {
  code: string;
}

export const Effect = db.getDatabase.collection<EffectSchema>("effects");
