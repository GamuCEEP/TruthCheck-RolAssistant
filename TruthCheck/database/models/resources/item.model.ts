import { mongo } from "root/deps.ts";

interface Item {
  _id: mongo.ObjectId;
  author: mongo.ObjectId;
  name: string;
  description: string;
  efects: Record<string, mongo.ObjectId>;
  tags: [string];
}

export default Item;
