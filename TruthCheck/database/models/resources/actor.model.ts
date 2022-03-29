import { mongo } from "root/deps.ts";

interface Actor {
  _id: mongo.ObjectId;
  author: mongo.ObjectId;
  name: string;
  description: string;
  stats: Record<string, string>;
  effects: Record<string, mongo.ObjectId>;
  inventory: [mongo.ObjectId];
  equipment: [mongo.ObjectId];
  tags: [string];
}

export default Actor;