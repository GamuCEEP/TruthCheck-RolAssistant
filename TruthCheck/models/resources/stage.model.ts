import db from "../../db/db.ts";

export interface StageSchema {
  _id: string;
  author: /*reference to user*/ string;
  name: string;
  description: string;
  stats: Record<string, string>;
  pasive: /*array of references to effect*/string;
  image: string;/*How do you upload images */
  tags: string[];
}

export const User = db.getDatabase.collection<StageSchema>("stages");
