import db from "../../db/db.ts";

export interface ActorSchema {
  _id: string;
  author: /*reference to user*/ string;
  name: string;
  description: string;
  stats: Record<string, string>;
  pasive: /*array of references to effect*/string;
  active: /*array of references to effect*/string;
  inventory: /*array of references to item*/string;
  equipment: /*array of references to item*/string;
  tags: string[];
}

export const User = db.getDatabase.collection<ActorSchema>("actors");
