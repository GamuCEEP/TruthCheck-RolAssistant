import db from "../../db/db.ts";
import { ForeignKey } from "../../types/types.interface.ts";

export interface ActorSchema {
  _id: string;
  author: ForeignKey;
  name: string;
  description: string;
  stats: Record<string, string>;
  pasive: ForeignKey[];
  active: ForeignKey[];
  inventory: ForeignKey[];
  equipment: ForeignKey[];
  imageURI: string;
  tags: string[];
}

export const User = db.getDatabase.collection<ActorSchema>("actors");
