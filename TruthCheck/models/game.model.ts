import db from "../db/db.ts";
import { ForeignKey } from "../types/types.interface.ts";

export interface GameSchema {
  _id: string;
  author: string;
  name: string;
  description: string;
  docVersion: number;
  isShared: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  actors: string[];
  stages: {
    stage: string;
    deck: {
      odds: number;
      resource: ForeignKey;
      condition?: string;
    }[];
  }[];
}

export const Game = db.getDatabase.collection<GameSchema>("games");
