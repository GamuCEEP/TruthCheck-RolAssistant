import db from "../../db/db.ts";
import { ForeignKey } from "../../types/types.interface.ts";

export interface EffectSchema {
  _id: string;
  author: ForeignKey;
  name: string;
  description: string;
  code: string;
  imageURI: string;
  tags: string[];
}

export const User = db.getDatabase.collection<EffectSchema>("effects");
