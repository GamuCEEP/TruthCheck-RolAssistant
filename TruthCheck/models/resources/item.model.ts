import db from "../../db/db.ts";
import { ForeignKey } from "../../types/types.interface.ts";

export interface ItemSchema {
  _id: string;
  author: ForeignKey;
  name: string;
  description: string;
  pasive: ForeignKey[];
  active: ForeignKey[];
  imageURI: string;
  tags: string[];
}

export const User = db.getDatabase.collection<ItemSchema>("items");
