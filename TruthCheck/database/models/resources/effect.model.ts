import { mongo } from "root/deps.ts";

interface Effect {
  _id: mongo.ObjectId;
  author: mongo.ObjectId;
  name: string;
  description: string;
  code: string;
}

export default Effect;
