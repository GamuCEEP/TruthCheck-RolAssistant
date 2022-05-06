import db from "../../db/db.ts";

export interface ItemSchema {
  _id: string;
  author: /*reference to user*/ string;
  name: string;
  description: string;
  pasive: /*array of references to effect*/string;
  active: /*array of references to effect*/string;
  tags: string[];
}

export const User = db.getDatabase.collection<ItemSchema>("items");
