import db from "../db/db.ts";
import { Bson } from "../deps.ts";

export interface testSchema {
  _id: string;
  author: Bson.UUID;
}

export const User = db.getDatabase.collection<testSchema>("test");
