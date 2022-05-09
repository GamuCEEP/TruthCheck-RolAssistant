import db from "../../db/db.ts";
import { ForeignKey } from "../../types/types.interface.ts";

export interface StageSchema {
  _id: string;
  author: ForeignKey;
  name: string;
  description: string;
  pasive: ForeignKey[];
  imageURI: string;
  tags: string[];
}

export const User = db.getDatabase.collection<StageSchema>("stages");
